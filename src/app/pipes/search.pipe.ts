import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(transactions: any[], searchText: string): any[] {
    if (!transactions || !searchText) {
      return transactions;
    }

    searchText = searchText.toLowerCase();

    return transactions.filter(transaction =>
      transaction.fromAcno.toString() === searchText ||
      transaction.toAcno.toString() === searchText ||
      transaction.type.toLowerCase().includes(searchText)  // Search by type
    );
  }
}
