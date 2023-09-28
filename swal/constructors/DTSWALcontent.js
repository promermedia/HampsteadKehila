import { QasTable } from "../../../HTMLElems/table/table";

export class DTSWALcontent extends HTMLElement{
  constructor(_addForm = [], _table) {
    super()
    this.table = _table;
    const FormDiv = document.createElement("div");
    FormDiv.className = "dt-swal-form-cont";

    _addForm.forEach((x) => {
      FormDiv.append(x);
    });

    const TableDiv = document.createElement("div");
    TableDiv.className = "dt-swal-table-cont";
    TableDiv.append(this.table);
    this.append(FormDiv, TableDiv)
  }
}

customElements.define("dtswal-content", DTSWALcontent);
