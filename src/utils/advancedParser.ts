import {
  Program,
  Statement,
  Expression,
  BlockStatement,
  VariableDeclaration,
  IfStatement,
  WhileStatement,
  ForStatement,
  FunctionDeclaration,
  ReturnStatement,
  ExpressionStatement,
  BinaryExpression,
  UnaryExpression,
  CallExpression,
  AssignmentExpression,
  Identifier,
  Literal,
  LogicalExpression,
} from './ast'

type Token = {
  type: string
  value: string
  line: number
  col: number
}

class Tokenizer {
  private input: string
  private pos = 0
  private line = 1
  private col = 1
  private tokens: Token[] = []

  constructor(input: string) {
    this.input = input
  }

  tokenize(): Token[] {
    while (this.pos < this.input.length) {
      this.skipWhitespaceAndComments()

      if (this.pos >= this.input.length) break

      const char = this.input[this.pos]

      if (char === '{' || char === '}' || char === '(' || char === ')' || char === '[' || char === ']' || char === ';' || char === ',') {
        this.tokens.push({ type: char, value: char, line: this.line, col: this.col })
        this.advance()
      } else if (char === '=') {
        if (this.peek() === '=') {
          this.tokens.push({ type: '==', value: '==', line: this.line, col: this.col })
          this.advance()
          this.advance()
        } else {
          this.tokens.push({ type: '=', value: '=', line: this.line, col: this.col })
          this.advance()
        }
      } else if (char === '!' && this.peek() === '=') {
        this.tokens.push({ type: '!=', value: '!=', line: this.line, col: this.col })
        this.advance()
        this.advance()
      } else if (char === '!' && this.peek() !== '=') {
        this.tokens.push({ type: '!', value: '!', line: this.line, col: this.col })
        this.advance()
      } else if (char === '<') {
        if (this.peek() === '=') {
          this.tokens.push({ type: '<=', value: '<=', line: this.line, col: this.col })
          this.advance()
          this.advance()
        } else {
          this.tokens.push({ type: '<', value: '<', line: this.line, col: this.col })
          this.advance()
        }
      } else if (char === '>') {
        if (this.peek() === '=') {
          this.tokens.push({ type: '>=', value: '>=', line: this.line, col: this.col })
          this.advance()
          this.advance()
        } else {
          this.tokens.push({ type: '>', value: '>', line: this.line, col: this.col })
          this.advance()
        }
      } else if (char === '&' && this.peek() === '&') {
        this.tokens.push({ type: '&&', value: '&&', line: this.line, col: this.col })
        this.advance()
        this.advance()
      } else if (char === '|' && this.peek() === '|') {
        this.tokens.push({ type: '||', value: '||', line: this.line, col: this.col })
        this.advance()
        this.advance()
      } else if (char === '+') {
        if (this.peek() === '=') {
          this.tokens.push({ type: '+=', value: '+=', line: this.line, col: this.col })
          this.advance()
          this.advance()
        } else if (this.peek() === '+') {
          this.tokens.push({ type: '++', value: '++', line: this.line, col: this.col })
          this.advance()
          this.advance()
        } else {
          this.tokens.push({ type: '+', value: '+', line: this.line, col: this.col })
          this.advance()
        }
      } else if (char === '-') {
        if (this.peek() === '=') {
          this.tokens.push({ type: '-=', value: '-=', line: this.line, col: this.col })
          this.advance()
          this.advance()
        } else if (this.peek() === '-') {
          this.tokens.push({ type: '--', value: '--', line: this.line, col: this.col })
          this.advance()
          this.advance()
        } else {
          this.tokens.push({ type: '-', value: '-', line: this.line, col: this.col })
          this.advance()
        }
      } else if (char === '*') {
        if (this.peek() === '=') {
          this.tokens.push({ type: '*=', value: '*=', line: this.line, col: this.col })
          this.advance()
          this.advance()
        } else {
          this.tokens.push({ type: '*', value: '*', line: this.line, col: this.col })
          this.advance()
        }
      } else if (char === '/') {
        if (this.peek() === '=') {
          this.tokens.push({ type: '/=', value: '/=', line: this.line, col: this.col })
          this.advance()
          this.advance()
        } else {
          this.tokens.push({ type: '/', value: '/', line: this.line, col: this.col })
          this.advance()
        }
      } else if (char === '%') {
        this.tokens.push({ type: '%', value: '%', line: this.line, col: this.col })
        this.advance()
      } else if (char >= '0' && char <= '9') {
        const num = this.readNumber()
        this.tokens.push({ type: 'NUMBER', value: num, line: this.line, col: this.col - num.length })
      } else if (this.isIdentifierStart(char)) {
        const id = this.readIdentifier()
        const type = this.isKeyword(id) ? id.toUpperCase() : 'IDENTIFIER'
        this.tokens.push({ type, value: id, line: this.line, col: this.col - id.length })
      } else if (char === '"' || char === "'") {
        const str = this.readString()
        this.tokens.push({ type: 'STRING', value: str, line: this.line, col: this.col - str.length - 2 })
      } else {
        this.advance()
      }
    }

    this.tokens.push({ type: 'EOF', value: '', line: this.line, col: this.col })
    return this.tokens
  }

  private skipWhitespaceAndComments() {
    while (this.pos < this.input.length) {
      const char = this.input[this.pos]
      if (char === ' ' || char === '\t' || char === '\r') {
        this.advance()
      } else if (char === '\n') {
        this.line++
        this.col = 1
        this.pos++
      } else if (char === '/' && this.peek() === '/') {
        this.pos += 2
        while (this.pos < this.input.length && this.input[this.pos] !== '\n') this.pos++
      } else if (char === '/' && this.peek() === '*') {
        this.pos += 2
        while (this.pos < this.input.length) {
          if (this.input[this.pos] === '*' && this.peek() === '/') {
            this.pos += 2
            break
          }
          if (this.input[this.pos] === '\n') this.line++
          this.pos++
        }
      } else {
        break
      }
    }
  }

  private readNumber(): string {
    let num = ''
    while (this.pos < this.input.length && this.input[this.pos] >= '0' && this.input[this.pos] <= '9') {
      num += this.input[this.pos]
      this.advance()
    }
    if (this.input[this.pos] === '.' && this.input[this.pos + 1] >= '0' && this.input[this.pos + 1] <= '9') {
      num += this.input[this.pos]
      this.advance()
      while (this.pos < this.input.length && this.input[this.pos] >= '0' && this.input[this.pos] <= '9') {
        num += this.input[this.pos]
        this.advance()
      }
    }
    return num
  }

  private readIdentifier(): string {
    let id = ''
    while (this.pos < this.input.length && (this.isIdentifierPart(this.input[this.pos]))) {
      id += this.input[this.pos]
      this.advance()
    }
    return id
  }

  private readString(): string {
    const quote = this.input[this.pos]
    this.advance()
    let str = ''
    while (this.pos < this.input.length && this.input[this.pos] !== quote) {
      if (this.input[this.pos] === '\\') {
        this.advance()
        const escapeChar = this.input[this.pos]
        switch (escapeChar) {
          case 'n':
            str += '\n'
            break
          case 't':
            str += '\t'
            break
          case 'r':
            str += '\r'
            break
          case '\\':
            str += '\\'
            break
          case quote:
            str += quote
            break
          default:
            str += escapeChar
        }
      } else {
        str += this.input[this.pos]
      }
      this.advance()
    }
    if (this.input[this.pos] === quote) this.advance()
    return str
  }

  private isIdentifierStart(char: string): boolean {
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_' || char === '$'
  }

  private isIdentifierPart(char: string): boolean {
    return this.isIdentifierStart(char) || (char >= '0' && char <= '9')
  }

  private isKeyword(word: string): boolean {
    return ['if', 'else', 'while', 'for', 'function', 'return', 'var', 'let', 'const', 'true', 'false'].includes(word)
  }

  private advance() {
    if (this.input[this.pos] === '\n') {
      this.line++
      this.col = 1
    } else {
      this.col++
    }
    this.pos++
  }

  private peek(offset = 1): string {
    return this.input[this.pos + offset] || ''
  }
}

class Parser {
  private tokens: Token[]
  private pos = 0

  constructor(tokens: Token[]) {
    this.tokens = tokens
  }

  parse(): Program {
    const body: Statement[] = []
    while (!this.isAtEnd()) {
      const stmt = this.parseStatement()
      if (stmt) body.push(stmt)
    }
    return { type: 'Program', body }
  }

  private parseStatement(): Statement | null {
    const token = this.peek()

    if (token.type === 'IF') return this.parseIfStatement()
    if (token.type === 'WHILE') return this.parseWhileStatement()
    if (token.type === 'FOR') return this.parseForStatement()
    if (token.type === 'FUNCTION') return this.parseFunctionDeclaration()
    if (token.type === 'RETURN') return this.parseReturnStatement()
    if (token.type === 'VAR' || token.type === 'LET' || token.type === 'CONST') return this.parseVariableDeclaration()
    if (token.type === '{') return this.parseBlockStatement()

    const expr = this.parseExpression()
    this.consume(';', "Expected ';' after expression")
    return { type: 'ExpressionStatement', expression: expr } as ExpressionStatement
  }

  private parseIfStatement(): IfStatement {
    this.consume('IF', "Expected 'if'")
    this.consume('(', "Expected '(' after 'if'")
    const condition = this.parseExpression()
    this.consume(')', "Expected ')' after condition")
    const consequent = this.parseBlockStatement()

    let alternate: BlockStatement | IfStatement | undefined
    if (this.peek().type === 'ELSE') {
      this.advance()
      if (this.peek().type === 'IF') {
        alternate = this.parseIfStatement()
      } else {
        alternate = this.parseBlockStatement()
      }
    }

    return { type: 'IfStatement', condition, consequent, alternate }
  }

  private parseWhileStatement(): WhileStatement {
    this.consume('WHILE', "Expected 'while'")
    this.consume('(', "Expected '(' after 'while'")
    const condition = this.parseExpression()
    this.consume(')', "Expected ')' after condition")
    const body = this.parseBlockStatement()
    return { type: 'WhileStatement', condition, body }
  }

  private parseForStatement(): ForStatement {
    this.consume('FOR', "Expected 'for'")
    this.consume('(', "Expected '(' after 'for'")

    let init: VariableDeclaration | Expression | undefined
    if (this.peek().type !== ';') {
      if (this.peek().type === 'VAR' || this.peek().type === 'LET' || this.peek().type === 'CONST') {
        init = this.parseVariableDeclaration()
      } else {
        init = this.parseExpression()
        this.consume(';', "Expected ';' after for init")
      }
    } else {
      this.advance()
    }

    let condition: Expression | undefined
    if (this.peek().type !== ';') {
      condition = this.parseExpression()
    }
    this.consume(';', "Expected ';' after for condition")

    let update: Expression | undefined
    if (this.peek().type !== ')') {
      update = this.parseExpression()
    }
    this.consume(')', "Expected ')' after for clauses")

    const body = this.parseBlockStatement()
    return { type: 'ForStatement', init, condition, update, body }
  }

  private parseFunctionDeclaration(): FunctionDeclaration {
    this.consume('FUNCTION', "Expected 'function'")
    const name = this.consume('IDENTIFIER', "Expected function name").value
    this.consume('(', "Expected '(' after function name")

    const params: string[] = []
    if (this.peek().type !== ')') {
      do {
        if (this.peek().type === ',') this.advance()
        params.push(this.consume('IDENTIFIER', 'Expected parameter name').value)
      } while (this.peek().type === ',')
    }
    this.consume(')', "Expected ')' after parameters")

    const body = this.parseBlockStatement()
    return { type: 'FunctionDeclaration', name, params, body }
  }

  private parseReturnStatement(): ReturnStatement {
    this.consume('RETURN', "Expected 'return'")
    let argument: Expression | undefined
    if (this.peek().type !== ';' && this.peek().type !== '}' && this.peek().type !== 'EOF') {
      argument = this.parseExpression()
    }
    if (this.peek().type === ';') this.consume(';', '')
    return { type: 'ReturnStatement', argument }
  }

  private parseVariableDeclaration(): VariableDeclaration {
    this.advance() // consume var/let/const
    const name = this.consume('IDENTIFIER', 'Expected variable name').value
    let value: Expression | undefined
    if (this.peek().type === '=') {
      this.advance()
      value = this.parseExpression()
    }
    if (this.peek().type === ';') this.consume(';', '')
    return { type: 'VariableDeclaration', name, value }
  }

  private parseBlockStatement(): BlockStatement {
    this.consume('{', "Expected '{'")
    const body: Statement[] = []
    while (this.peek().type !== '}' && !this.isAtEnd()) {
      const stmt = this.parseStatement()
      if (stmt) body.push(stmt)
    }
    this.consume('}', "Expected '}'")
    return { type: 'BlockStatement', body }
  }

  private parseExpression(): Expression {
    return this.parseLogicalOr()
  }

  private parseLogicalOr(): Expression {
    let expr = this.parseLogicalAnd()
    while (this.peek().type === '||') {
      this.advance()
      const right = this.parseLogicalAnd()
      expr = { type: 'LogicalExpression', operator: '||', left: expr, right }
    }
    return expr
  }

  private parseLogicalAnd(): Expression {
    let expr = this.parseEquality()
    while (this.peek().type === '&&') {
      this.advance()
      const right = this.parseEquality()
      expr = { type: 'LogicalExpression', operator: '&&', left: expr, right }
    }
    return expr
  }

  private parseEquality(): Expression {
    let expr = this.parseComparison()
    while (this.peek().type === '==' || this.peek().type === '!=') {
      const op = this.advance().value as any
      const right = this.parseComparison()
      expr = { type: 'BinaryExpression', operator: op, left: expr, right }
    }
    return expr
  }

  private parseComparison(): Expression {
    let expr = this.parseAdditive()
    while (this.peek().type === '<' || this.peek().type === '>' || this.peek().type === '<=' || this.peek().type === '>=') {
      const op = this.advance().value as any
      const right = this.parseAdditive()
      expr = { type: 'BinaryExpression', operator: op, left: expr, right }
    }
    return expr
  }

  private parseAdditive(): Expression {
    let expr = this.parseMultiplicative()
    while (this.peek().type === '+' || this.peek().type === '-') {
      const op = this.advance().value as any
      const right = this.parseMultiplicative()
      expr = { type: 'BinaryExpression', operator: op, left: expr, right }
    }
    return expr
  }

  private parseMultiplicative(): Expression {
    let expr = this.parseUnary()
    while (this.peek().type === '*' || this.peek().type === '/' || this.peek().type === '%') {
      const op = this.advance().value as any
      const right = this.parseUnary()
      expr = { type: 'BinaryExpression', operator: op, left: expr, right }
    }
    return expr
  }

  private parseUnary(): Expression {
    if (this.peek().type === '!' || this.peek().type === '-' || this.peek().type === '+' || this.peek().type === '++' || this.peek().type === '--') {
      const op = this.advance().value as any
      const argument = this.parseUnary()
      return { type: 'UnaryExpression', operator: op, argument, prefix: true }
    }
    return this.parsePostfix()
  }

  private parsePostfix(): Expression {
    let expr = this.parseAssignment()
    if (this.peek().type === '++' || this.peek().type === '--') {
      const op = this.advance().value as any
      return { type: 'UnaryExpression', operator: op, argument: expr as Identifier, prefix: false }
    }
    return expr
  }

  private parseAssignment(): Expression {
    const expr = this.parsePrimary()
    if (this.peek().type === '=' || this.peek().type === '+=' || this.peek().type === '-=' || this.peek().type === '*=' || this.peek().type === '/=') {
      if (expr.type !== 'Identifier') throw new Error('Invalid assignment target')
      const op = this.advance().value as any
      const right = this.parseExpression()
      return { type: 'AssignmentExpression', left: expr, operator: op, right }
    }
    return expr
  }

  private parsePrimary(): Expression {
    const token = this.peek()

    if (token.type === 'TRUE') {
      this.advance()
      return { type: 'Literal', value: true, raw: 'true' }
    }

    if (token.type === 'FALSE') {
      this.advance()
      return { type: 'Literal', value: false, raw: 'false' }
    }

    if (token.type === 'NUMBER') {
      this.advance()
      return { type: 'Literal', value: parseFloat(token.value), raw: token.value }
    }

    if (token.type === 'STRING') {
      this.advance()
      return { type: 'Literal', value: token.value, raw: `"${token.value}"` }
    }

    if (token.type === 'IDENTIFIER') {
      const name = this.advance().value
      if (this.peek().type === '(') {
        this.advance()
        const args: Expression[] = []
        if (this.peek().type !== ')') {
          do {
            if (this.peek().type === ',') this.advance()
            args.push(this.parseExpression())
          } while (this.peek().type === ',')
        }
        this.consume(')', "Expected ')' after arguments")
        return { type: 'CallExpression', callee: { type: 'Identifier', name }, arguments: args }
      }
      return { type: 'Identifier', name }
    }

    if (token.type === '(') {
      this.advance()
      const expr = this.parseExpression()
      this.consume(')', "Expected ')' after expression")
      return expr
    }

    throw new Error(`Unexpected token: ${token.type}`)
  }

  private peek(): Token {
    return this.tokens[this.pos] || { type: 'EOF', value: '', line: 0, col: 0 }
  }

  private advance(): Token {
    return this.tokens[this.pos++] || { type: 'EOF', value: '', line: 0, col: 0 }
  }

  private consume(type: string, message: string): Token {
    if (this.peek().type !== type) {
      throw new Error(`${message} at line ${this.peek().line}`)
    }
    return this.advance()
  }

  private isAtEnd(): boolean {
    return this.peek().type === 'EOF'
  }
}

export function parseAdvancedCode(code: string): Program {
  const tokenizer = new Tokenizer(code)
  const tokens = tokenizer.tokenize()
  const parser = new Parser(tokens)
  return parser.parse()
}
