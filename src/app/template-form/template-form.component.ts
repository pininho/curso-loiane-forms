import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss']
})
export class TemplateFormComponent implements OnInit {


  usuario: any = {
    nome:null, //'Alessandro',
    email: null//'alessandro@email.com'
  }

  onSubmit(form) {
    console.log(form.value);

    console.log(this.usuario);
  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  aplicaCssErro(campo) {
    return {'is-invalid': !campo.valid && campo.touched};
  }

  consultaCEP(cep) {
    //console.log(cep);
    //nova var cep só com dígitos
    cep = cep.replace(/\D/g, '');
    //verifica se cep tem valor
    if(cep != "") {
      //expressão regular para validar o cep
      var validacep = /^[0-9]{8}$/;
      //validar o formato do cep
      if(validacep.test(cep)) {
        this.http.get(`//viacep.com.br/ws/${cep}/json/`)
        .pipe(map(dados =>  dados))
        .subscribe(dados => console.log(dados))
      }
    }
  }

}
