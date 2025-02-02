import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViacepService } from '../../_services/viacep.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent implements OnInit {

  form: FormGroup = new FormGroup({});
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private viacepService: ViacepService) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.fb.group({
      cep: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]], // Aceita apenas 8 dígitos numéricos
      logradouro: [''],
      bairro: [''],
      cidade: [''],
      estado: ['']
    });
  }

  buscarCep() {
    const cep = this.form.get('cep')?.value;

    if (!cep || cep.length !== 8) {
      this.errorMessage = 'Digite um CEP válido com 8 dígitos.';
      return;
    }

    this.viacepService.getEnderecoByCep(cep).subscribe({
      next: (response) => {
        if (response.erro) {
          this.errorMessage = 'CEP não encontrado.';
          this.limparCampos(false);
        } else {
          this.form.patchValue({
            logradouro: response.logradouro,
            bairro: response.bairro,
            cidade: response.localidade,
            estado: response.uf
          });
          this.errorMessage = '';
        }
      },
      error: () => {
        this.errorMessage = 'Erro ao buscar o CEP. Verifique se o CEP está correto.';
        this.limparCampos(false);
      }
    });
  }


  limparCampos(resetCep: boolean = true) {
    if (resetCep) {
      this.form.reset();
    } else {
      this.form.patchValue({
        logradouro: '',
        bairro: '',
        cidade: '',
        estado: ''
      });
    }
    this.errorMessage = '';
  }
}
