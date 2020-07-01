export interface Instruction {
  type: string;
  [key: string]: any;
}

export enum InstructionType {
  TABLE = 'TABLE',
  WHERE = 'WHERE',
  UPDATE = 'UPDATE',
  INDEX = 'INDEX',
  ITEM = 'ITEM',
}

export default class QueryBuilder {
  public instructions: Array<Instruction> = [];

  constructor(name?: string) {
    if (name) {
      this.table(name);
    }
  }

  table(name: string) {
    this.instructions.push({
      type: 'TABLE',
      name,
    });
  }

  where(keyVal: { [name: string]: any }, operator: string): QueryBuilder {
    const keyName = Object.keys(keyVal).shift();
    this.instructions.push({
      type: 'WHERE',
      field: keyName,
      operator,
      value: keyVal[keyName as string],
    });
    return this;
  }

  whereIs(keyVal: { [name: string]: any }): QueryBuilder {
    this.where(keyVal, '=');
    return this;
  }

  setFields(keyValues: { [names: string]: any }): QueryBuilder {
    const updates = Object.keys(keyValues).reduce(
      (acc: Array<any>, currKey: string) => {
        return [
          ...acc,
          { field: currKey, operator: '=', value: keyValues[currKey] },
        ];
      },
      []
    );

    this.instructions.push({
      type: 'UPDATE',
      updates,
    });
    return this;
  }

  index(indexName: string): QueryBuilder {
    this.instructions.push({
      type: 'INDEX',
      index: indexName,
    });
    return this;
  }

  options(options: any): QueryBuilder {
    this.instructions.push({
      type: 'OPTIONS',
      options,
    });
    return this;
  }

  item(item: any): QueryBuilder {
    this.instructions.push({
      type: 'ITEM',
      item,
    });
    return this;
  }
}
