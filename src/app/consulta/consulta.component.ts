import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms'; 
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ClienteService } from '../cliente.service';
import { Cliente } from '../cadastro/cliente';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-consulta',
  imports: [
    FlexLayoutModule,
    MatCardModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss'
})
export class ConsultaComponent implements OnInit {


  nomeBusca: string = '';
  listaClientes: Cliente[] = [];
  colunasTable: string[] = ['id', 'nome', 'cpf', 'dataNascimento', 'email', "acoes"];
  snack: MatSnackBar = inject(MatSnackBar);

  constructor(
    private service: ClienteService,
    private router: Router,
  ) {
    
  }

  ngOnInit() {
    // console.log('Passando pelo ngOnInit');
    this.listaClientes = this.service.pesquisarClientes('');
  }

  pesquisar(){
    this.listaClientes = this.service.pesquisarClientes(this.nomeBusca);
  }

  preparaEditar(id: string){
    //this.router.navigate(['/cadastro', id]);
    this.router.navigate(['/cadastro'], { queryParams: { "id": id } });
  }
  
  preparaDeletar(cliente: Cliente){
    cliente.deletando = true;
  }

  deletar(cliente: Cliente){
    this.service.deletar(cliente);
    this.listaClientes = this.service.pesquisarClientes('');
    this.snack.open('Cliente deletado com scesso', 'OK') 
  }
}