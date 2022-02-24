import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { map } from 'rxjs/operators';
import { DropdownService } from '../shared/services/dropdown.service';
import { EstadosBr } from './../shared/models/estados-br';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.scss'],
})
export class DataFormComponent implements OnInit {
  formulario: FormGroup;
  estados: EstadosBr[];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    /*this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),
      endereco: new FormGroup({
        cep: new FormControl(null)
        //...
      })
    }); */

    this.dropdownService.getEstadosBr().subscribe((dados: EstadosBr[]) => {
      this.estados = dados;
      console.log(dados);
    });

    this.formulario = this.formBuilder.group({
      //Exemplos validação:
      //[null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null], //Não é obrigatório o complemento
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],
      }),
    });
  }

  onSubmit() {
    console.log(this.formulario.value);

    if (this.formulario.valid) {
      this.http
        .post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
        .pipe(map((res) => res))
        .subscribe(
          (dados) => {
            console.log(dados);
            //reseta o form
            //this.formulario.reset();
            this.resetar();
          },
          (error: any) => alert('erro')
        );
    } else {
      this.verificaValidacoesForm(this.formulario);
    }
  }

  verificaValidacoesForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((campo) => {
      console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsDirty();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  resetar() {
    this.formulario.reset();
  }

  aplicaCssErro(campo: string) {
    return {
      'is-invalid':
        (!this.formulario.get(campo).valid &&
          this.formulario.get(campo).touched) ||
        this.formulario.get(campo).dirty,
      'is-valid':
        (this.formulario.get(campo).valid &&
          this.formulario.get(campo).touched) ||
        this.formulario.get(campo).dirty,
    };
  }

  verificaEmailInvalido() {
    let campoEmail = this.formulario.get('email');
    if (campoEmail.get('email').errors) {
      return campoEmail.get('email').errors['email'] && campoEmail.touched;
    }
  }

  consultaCEP() {
    let cep = this.formulario.get('endereco.cep').value;

    //console.log(cep);
    //nova var cep só com dígitos
    cep = cep.replace(/\D/g, '');
    //verifica se cep tem valor
    if (cep != '') {
      //expressão regular para validar o cep
      var validacep = /^[0-9]{8}$/;
      //validar o formato do cep
      if (validacep.test(cep)) {
        this.resetaDadosForm();
        this.http
          .get(`//viacep.com.br/ws/${cep}/json/`)
          .pipe(map((dados) => dados))
          .subscribe((dados) => this.populaDadosForm(dados));
      }
    }
  }

  resetaDadosForm() {
    this.formulario.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null,
      },
    });
  }

  populaDadosForm(dados) {
    /*form.setValue({
      nome: form.value.nome,
      email: form.value.email,
      endereco: {
        cep: dados.cep,
        rua: dados.logradouro,
        numero:'',
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });*/

    this.formulario.patchValue({
      endereco: {
        rua: dados.logradouro,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf,
      },
    });
  }
}
