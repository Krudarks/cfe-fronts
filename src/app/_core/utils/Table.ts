

export class Table {
    static removeItemFromTable(dataSource: any, idItem: any, field: string = 'id'): void {

        const data = dataSource.data;

        const index = data.findIndex((x: any) => x[field] === idItem);

        if (index > -1) {
            data.splice(index, 1);
        }

        dataSource.data = data;
    }

    static removeItemFromTableIndex(dataSource: any, idItem: any): void {

        const data = dataSource.data;

        if (idItem > -1) {
            data.splice(idItem, 1);
        }

        dataSource.data = data;
    }

    static refreshTable(dataSource: any, data: any, sort: any, paginator: any, matTableDataSource: any): void {
        dataSource = new matTableDataSource(data);
        dataSource.sort = sort;
        dataSource.paginator = paginator;
    }

    static tableAddItem(dataSource: any, user: any): void {
        const data = dataSource.data;

        data.push(user);

        dataSource.data = data;
    }

    static updateRow(dataSource: any, newUserData: any): void {
        const data = dataSource.data;

        const foundIndex = data.findIndex((x: any) => x.id === newUserData.id);

        data[foundIndex] = newUserData;

        dataSource.data = data;
    }

    static applyFilter(dataSource: any, event: Event): void {
        const filterValue = ( event.target as HTMLInputElement ).value;
        dataSource.filter = filterValue.trim().toLowerCase();

        if (dataSource.paginator) {
            dataSource.paginator.firstPage();
        }
    }

}
