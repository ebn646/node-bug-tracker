export interface ICard {
  _id: string,
  listId:
   string,
}
export interface IList {
  _id: string,
  name: string,
  order: string,
}

export interface IColumn {
  index: number,
  column: {
      _id: string,
      name: string,
      order: string,
  },
  tasks:any[],
  updateCards:() => void,
  deleteList:(id:string) => void,
  editList:(name:string, id: string) => void,
  updateActivities:() => void,
}
