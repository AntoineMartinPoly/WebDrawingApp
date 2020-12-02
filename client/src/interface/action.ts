export interface Action {
    type?: string;
}

export enum SelectionAction {
  paste,
  cut,
  delete,
  duplicate,
  translate,
  rotate,
  resize,
  selecting,
}
