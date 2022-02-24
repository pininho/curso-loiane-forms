import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {

  constructor(private http: HttpClient) { }

  consultaCEP(cep: string) {

    //nova var cep só com dígitos
    cep = cep.replace(/\D/g, '');
    //verifica se cep tem valor
    if (cep != '') {
      //expressão regular para validar o cep
      var validacep = /^[0-9]{8}$/;
      //validar o formato do cep
      if (validacep.test(cep)) {
       return this.http
          .get(`//viacep.com.br/ws/${cep}/json/`)
          .pipe(map((dados) => dados));
      }
    }

    return of({});
  }

}
