import { Component, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, FormGroupDirective } from '@angular/forms';
import { SideSlider } from '@apex/apex-material';
import { TechSpecialtySelectorSliderComponent } from '../../components';

@Component({
  selector: 'app-screener-tech-specialty-lookup-control',
  templateUrl: './screener-tech-specialty-lookup-control.component.html',
  styleUrls: ['./screener-tech-specialty-lookup-control.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ScreenerTechSpecialtyLookupControlComponent implements OnInit {
  parentForm: FormGroup;

  get techSpecialtyName() {
    return this.parentForm.get('techSpecialtyName');
  }

  get techSpecialtyId() {
    return this.parentForm.get('techSpecialtyId');
  }

  constructor(
    public formGroup: FormGroupDirective,
    private slider: SideSlider
  ) { }

  ngOnInit(): void {
    this.parentForm = this.formGroup.control;
  }

  onFindTechSpecialties() {
    const sliderRef = this.slider.open(TechSpecialtySelectorSliderComponent, {
      width: '750px',
      panelClass: ['full-height-slider', 'apex-side-slider-overlay'],
      disableClose: false,
      data: this.techSpecialtyId.value
    });

    sliderRef.beforeClosed()
      .subscribe(
        data => {
          if (data) {
            this.parentForm.patchValue({ ...data });
          }
        }
      );
  }

}
