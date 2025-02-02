import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViacepService } from '../../_services/viacep.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private viacepService: ViacepService) { }
  ngOnInit(): void {
    this.initializeForm();
    this.observePreenchimentoCep();
  }

  initializeForm() {
    this.form = this.fb.group({

      cep: ['', [Validators.required]],
      logradouro: [''],
      bairro: [''],
      cidade: [''],
      estado: ['']
    })
  }

  observePreenchimentoCep() {
    this.form.get('cep')?.valueChanges.subscribe(value => {
      if (value?.length == 8) {
        this.buscarCep();
      }
    })
  }

  buscarCep() {
    var cep = this.form.get('cep')?.value;
    this.viacepService.getEnderecoByCep(cep).subscribe(
      {
        next: (responce) => {
          this.form.patchValue({
            logradouro: responce.logradouro,
            bairro: responce.bairro,
            cidade: responce.localidade,
            estado: responce.uf
          })
        },
        error: () => {
          console.log("Error ao buscar o cep.")
        }
      }
    )
  }
}
