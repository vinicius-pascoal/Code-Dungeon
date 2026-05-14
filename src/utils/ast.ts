// Abstract Syntax Tree types para a linguagem do Code Dungeon

export type ASTNode =
  | Program
  | Statement
  | Expression

export type Program = {
  type: 'Program'
  body: Statement[]
}

export type Statement =
  | ExpressionStatement
  | VariableDeclaration
  | IfStatement
  | WhileStatement
  | ForStatement
  | FunctionDeclaration
  | ReturnStatement
  | BlockStatement

export type ExpressionStatement = {
  type: 'ExpressionStatement'
  expression: Expression
}

export type VariableDeclaration = {
  type: 'VariableDeclaration'
  name: string
  value?: Expression
}

export type IfStatement = {
  type: 'IfStatement'
  condition: Expression
  consequent: BlockStatement
  alternate?: BlockStatement | IfStatement
}

export type WhileStatement = {
  type: 'WhileStatement'
  condition: Expression
  body: BlockStatement
}

export type ForStatement = {
  type: 'ForStatement'
  init?: VariableDeclaration | Expression
  condition?: Expression
  update?: Expression
  body: BlockStatement
}

export type FunctionDeclaration = {
  type: 'FunctionDeclaration'
  name: string
  params: string[]
  body: BlockStatement
}

export type ReturnStatement = {
  type: 'ReturnStatement'
  argument?: Expression
}

export type BlockStatement = {
  type: 'BlockStatement'
  body: Statement[]
}

export type Expression =
  | Literal
  | Identifier
  | BinaryExpression
  | UnaryExpression
  | CallExpression
  | AssignmentExpression
  | LogicalExpression

export type Literal = {
  type: 'Literal'
  value: number | boolean | string
  raw: string
}

export type Identifier = {
  type: 'Identifier'
  name: string
}

export type BinaryExpression = {
  type: 'BinaryExpression'
  operator: '+' | '-' | '*' | '/' | '%' | '==' | '!=' | '<' | '>' | '<=' | '>='
  left: Expression
  right: Expression
}

export type UnaryExpression = {
  type: 'UnaryExpression'
  operator: '-' | '!' | '++' | '--'
  argument: Expression
  prefix: boolean
}

export type CallExpression = {
  type: 'CallExpression'
  callee: Identifier
  arguments: Expression[]
}

export type AssignmentExpression = {
  type: 'AssignmentExpression'
  left: Identifier
  operator: '=' | '+=' | '-=' | '*=' | '/='
  right: Expression
}

export type LogicalExpression = {
  type: 'LogicalExpression'
  operator: '&&' | '||'
  left: Expression
  right: Expression
}
