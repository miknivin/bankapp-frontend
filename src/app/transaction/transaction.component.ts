import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import jspdf from 'jspdf';
import 'jspdf-autotable'

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  currentAcno:string='';
  balance:any;
  transactions:any=[]
  searchText: string = '';
  searchType: string = 'both';
  logOutRouter:any

  constructor(private fb: FormBuilder, private api:ApiService){}
    ngOnInit(): void {
        this.api.transactionHistory().subscribe((result:any)=>{
            console.log(result);
            this.transactions=result.transactions
            console.log(this.transactions);

        },
        (result:any)=>{
            console.log(result.error.message);
        }
        )
    }

  getBalance(){
    this.api.getBalance(this.currentAcno).subscribe((result:any)=>{
      this.balance=result.balance
    }),
    (result:any)=>{
      alert(result.error.message)
    }
  }
//generate pdf
  generatePdf(){
    //1 create an object from js pdf
    var pdf = new jspdf()

    //2 setup row from the table
    let thead = ['Type', 'From Account', 'To Account', 'Amount']
    let tbody = []

    //3 setup properties for the table
    pdf.setFontSize(16)
    pdf.text('Mini Statements',15,10)

    //4 To display as table, we need  to convert array of objects into nested array
    for (let item of this.transactions){
      let temp = [item.type,item.fromAcno,item.toAcno,item.amount]
      tbody.push(temp)
    }

    //5 convert nested array into table structure using jspdf
    (pdf as any).autoTable(thead,tbody)

    //6 to open pdf in another
    pdf.output('dataurlnewwindow')

    //7 To download/save pdf
    pdf.save('Transaction History')
  }

  logout(){
    this.logOutRouter.navigateByUrl('')
    localStorage.clear()
  }
}
