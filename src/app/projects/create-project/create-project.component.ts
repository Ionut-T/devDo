import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ProjectHttpService } from '../project-http.service';
import { Subject, pipe } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ProjectStateService } from '../project-state.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  projectForm: FormGroup;
  mode: 'create' | 'edit';
  modalTitle: 'Create Project' | 'Edit Project';
  @Output() close = new EventEmitter<void>();
  private projectId: string;
  private destroy$ = new Subject<void>();

  constructor(private projectHttpService: ProjectHttpService, private projectStateService: ProjectStateService) {}

  ngOnInit() {
    this.projectForm = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(20)]
      }),
      description: new FormControl(null, {
        validators: [Validators.minLength(3), Validators.maxLength(100)]
      })
    });

    this.projectStateService.projectListener$.pipe(takeUntil(this.destroy$)).subscribe(id => (this.projectId = id));

    if (this.projectId) {
      this.mode = 'edit';
      this.modalTitle = 'Edit Project';
      this.projectStateService
        .getMappedProject(this.projectId)
        .subscribe(project => this.projectForm.setValue({ name: project.name, description: project.description }));
    } else {
      this.mode = 'create';
      this.modalTitle = 'Create Project';
    }
  }

  /**
   * Get title form control.
   */
  get name(): AbstractControl {
    return this.projectForm.get('name');
  }

  /**
   * Get descriptipon form control.
   */
  get description(): AbstractControl {
    return this.projectForm.get('description');
  }

  /**
   * Display title errors.
   */
  getNameErrors(): string {
    if (this.name.hasError('required')) {
      return 'You must add a name!';
    } else if (this.name.hasError('minlength')) {
      return 'The name must have minimum 3 characters';
    } else if (this.name.hasError('maxlength')) {
      return 'The name must have maximum 20 characters';
    }
  }

  /**
   * Display title errors.
   */
  getDescriptionErrors(): string {
    if (this.description.hasError('required')) {
      return 'You must add a description!';
    } else if (this.description.hasError('minlength')) {
      return 'The description must have minimum 3 characters';
    } else if (this.description.hasError('maxlength')) {
      return 'The description must have maximum 1000 characters';
    }
  }

  onSave() {
    console.log('CreateProjectComponent -> onSave -> this.mode', this.mode);
    if (this.mode === 'create') {
      this.projectHttpService
        .createProject({ id: null, name: this.name.value, description: this.description.value })
        .subscribe(console.log);
    } else if (this.mode === 'edit') {
      this.projectHttpService
        .updateProject(this.projectId, {
          name: this.name.value,
          description: this.description.value
        })
        .subscribe(console.log);
    }
    this.onClose();
  }

  /**
   * Close modal.
   */
  onClose() {
    this.close.emit();
  }
}
