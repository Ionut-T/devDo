import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ProjectHttpService } from '../project-http.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProjectStateService } from '../project-state.service';
import { Mode, ModalProjectTitle } from 'src/app/shared/enums';
import { displayFormErrors } from 'src/app/shared/form-errors.utils';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  public projectForm: FormGroup;
  public mode: Mode;
  public modalTitle: ModalProjectTitle;
  @Output() close = new EventEmitter<void>();
  private projectId: string;
  private destroy$ = new Subject<void>();

  constructor(private projectHttpService: ProjectHttpService, private projectStateService: ProjectStateService) {}

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)]
      }),
      description: new FormControl(null, {
        validators: [Validators.minLength(3), Validators.maxLength(100)]
      })
    });

    this.projectStateService.projectIdListener$.pipe(takeUntil(this.destroy$)).subscribe(id => (this.projectId = id));

    if (this.projectId) {
      this.mode = Mode.Edit;
      this.modalTitle = ModalProjectTitle.Edit;
      this.projectStateService
        .getMappedProject(this.projectId)
        .subscribe(project => this.projectForm.setValue({ name: project.name, description: project.description }));
    } else {
      this.mode = Mode.Create;
      this.modalTitle = ModalProjectTitle.Create;
    }
  }

  /**
   * Get title form control.
   */
  public get name(): AbstractControl {
    return this.projectForm.get('name');
  }

  /**
   * Get descriptipon form control.
   */
  public get description(): AbstractControl {
    return this.projectForm.get('description');
  }

  /**
   * Displays form errors.
   */
  public displayFormErrors(
    control: AbstractControl,
    placeholder: string,
    minLength: number,
    maxlength: number
  ): string {
    return displayFormErrors(control, placeholder, minLength, maxlength);
  }

  /**
   * Create or update project.
   */
  public onSave(): void {
    if (this.mode === 'create') {
      this.projectHttpService
        .createProject({ id: null, name: this.name.value, description: this.description.value })
        .subscribe(res => this.projectStateService.projectChange(res.body.project));
    } else if (this.mode === 'edit') {
      this.projectHttpService
        .updateProject(this.projectId, {
          name: this.name.value,
          description: this.description.value
        })
        .subscribe(res => this.projectStateService.projectChange(res.body.project));
    }

    this.onClose();
  }

  /**
   * Close modal.
   */
  public onClose(): void {
    this.close.emit();
  }
}
