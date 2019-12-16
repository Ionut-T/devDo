import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input() title: string;
  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  onClose() {
    this.close.emit();
  }
}
