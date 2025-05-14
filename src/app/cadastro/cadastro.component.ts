import { Component, OnInit, inject} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Cliente } from './cliente';
import { ClienteService } from '../cliente.service';
import { BrasilapiService } from '../brasilapi.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgxMaskDirective, provideNgxMask} from 'ngx-mask';
import { Estado, Municipio } from '../brasilapi.models';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-cadastro',
  imports: [
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    NgxMaskDirective
  ], providers: [
    provideNgxMask()  
  ],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
})
export class CadastroComponent implements OnInit {

  cliente: Cliente = Cliente.newCliente();
  atualizando: boolean = false;
  snackbar: MatSnackBar = inject(MatSnackBar);
  estados: Estado[] = [];
  municipios: Municipio[] = [];

  constructor(
    private service: ClienteService,
    private brasilApiService: BrasilapiService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  
  ngOnInit(): void {
    this.route.queryParamMap.subscribe( (query: any) => { 
      const params = query['params']
      const id = params['id']; 
      if(id){
        let clienteEncontrado = this.service.buscarClientePorId(id);
        if(clienteEncontrado){
        this.atualizando = true;
        this.cliente = clienteEncontrado;
        if(this.cliente.uf){
          const event = {value: this.cliente.uf} as MatSelectChange;
          this.carrregarMunicipios(event);
        }
        }
      }
    })

    this.carregarUFs();
  }   

  carregarUFs() {
    // observable e subscriber   (toda a aplicacao no Angular é assincrona)
    this.brasilApiService.listarUFs().subscribe({
       // next: listaEstados => console.log("lista estados", listaEstados),
       next: listaEstados => this.estados = listaEstados,
       error: erro => console.log("Ocorreu um erro:", erro),
    })

    // console.log("passou por aqui");
  }

  carrregarMunicipios(event: MatSelectChange){
    const ufSelecionada = event.value;
    this.brasilApiService.listarMunicipios(ufSelecionada).subscribe({
      next: listaMunicipios => this.municipios = listaMunicipios,
      error: erro => console.log("Ocorreu um erro:", erro),
    })  
  }

  salvar() {
    if (!this.atualizando) {
        this.service.salvar(this.cliente);
        this.cliente = Cliente.newCliente();
        this.mostrarMensagem('Cliente cadastrado com sucesso!')
    } else {
          this.service.atualizar(this.cliente);
          this.router.navigate(['/consulta']);
          this.mostrarMensagem('Atualizado com sucesso!')
    }
  }

  mostrarMensagem(mensagem: string) {
    this.snackbar.open(mensagem, "OK")
  }
}
