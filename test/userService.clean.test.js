const { UserService } = require('../src/userService');

const DADOS_USUARIO_PADRAO = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService', () => {
  let userService;

  // O setup é executado antes de cada teste, garantindo o isolamento
  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  // ---------------------------------------------------------------------------
  // Criação e Busca (Eager Test separado em responsabilidades únicas)
  // ---------------------------------------------------------------------------
  
  test('deve criar um usuário e atribuir um ID', () => {
    // Arrange
    const { nome, email, idade } = DADOS_USUARIO_PADRAO;

    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Assert
    expect(usuarioCriado.id).toBeDefined();
  });

  test('deve retornar os dados corretos ao buscar um usuário existente pelo ID', () => {
    // Arrange
    const { nome, email, idade } = DADOS_USUARIO_PADRAO;
    const usuarioCriado = userService.createUser(nome, email, idade);

    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);

    // Assert
    expect(usuarioBuscado.nome).toBe(nome);
    expect(usuarioBuscado.status).toBe('ativo');
  });

  // ---------------------------------------------------------------------------
  // Desativação (Lógica condicional removida - um cenário por teste)
  // ---------------------------------------------------------------------------

  test('deve desativar um usuário comum com sucesso', () => {
    // Arrange
    const usuarioComum = userService.createUser('Comum', 'comum@teste.com', 30);

    // Act
    const resultado = userService.deactivateUser(usuarioComum.id);
    const usuarioAtualizado = userService.getUserById(usuarioComum.id);

    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve permitir a desativação de um usuário administrador', () => {
    // Arrange
    const isAdmin = true;
    const usuarioAdmin = userService.createUser('Admin', 'admin@teste.com', 40, isAdmin);

    // Act
    const resultado = userService.deactivateUser(usuarioAdmin.id);

    // Assert
    expect(resultado).toBe(false);
  });

  // ---------------------------------------------------------------------------
  // Relatórios (Testes menos frágeis - valida o dado, não o formato exato)
  // ---------------------------------------------------------------------------

  test('deve incluir as informações essenciais dos usuários no relatório gerado', () => {
    // Arrange
    userService.createUser('Alice', 'alice@email.com', 28);
    userService.createUser('Bob', 'bob@email.com', 32);

    // Act
    const relatorio = userService.generateUserReport();
    
    // Assert
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('Bob');
    expect(relatorio).toContain('ativo');
  });

  test('deve indicar no relatório quando não há usuários cadastrados', () => {
    // Arrange
    // O setup inicial (`beforeEach`) já garante o banco limpo e vazio.

    // Act
    const relatorio = userService.generateUserReport();

    // Assert
    expect(relatorio).toContain('Nenhum usuário cadastrado');
  });

  // ---------------------------------------------------------------------------
  // Validações (Tratamento idiomático de exceções para evitar falsos positivos)
  // ---------------------------------------------------------------------------

  test('deve lançar exceção ao tentar criar um usuário menor de idade', () => {
    // Arrange
    const nome = 'Menor';
    const email = 'menor@email.com';
    const idadeInvalida = 17;

    // Act & Assert
    expect(() => {
      userService.createUser(nome, email, idadeInvalida);
    }).toThrow('O usuário deve ser maior de idade.');
  });

});