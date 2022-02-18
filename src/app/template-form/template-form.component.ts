import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  aplicaCssErro(campo) {
    return {'is-invalid': !campo.valid && campo.touched};
  }

}
