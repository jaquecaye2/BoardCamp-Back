import connection from "../dbStrategy/postgres.js";

export async function listarClientes(request, response) {
  try {
    // pegar a query string passada e tratar ela
    const { cpf } = request.query;

    if (!cpf) {
      // buscar todos os clientes no BD e enviá-los para o front
      const clientes = await connection.query("SELECT * FROM customers");

      response.send(clientes.rows);
    } else {
      // buscar todos os clientes no BD e enviá-los para o front
      const clientes = await connection.query(
        `SELECT * FROM customers WHERE cpf ILIKE '%${cpf}%'`
      );

      response.send(clientes.rows);
    }
  } catch (error) {
    response.status(500).send();
  }
}

export async function listarClienteId(request, response) {
  try {
    // pegar o id passado na rota
    const { id } = request.params;

    // selecionar o cliente com o id
    const { rows: clienteId } = await connection.query(
      "SELECT * FROM customers WHERE id=$1",
      [id]
    );

    // se o id não for encontrado, enviar erro
    if (clienteId.length === 0) {
      response.status(404).send();
      return;
    }

    response.send(clienteId[0]);
  } catch (error) {
    response.status(500).send();
  }
}

export async function inserirCliente(request, response) {
  try {
    const novoCliente = request.body;

    // verificar se o CPF já não foi criado, se sim, retornar erro
    const buscarCPF = await connection.query(
      `SELECT * FROM customers WHERE cpf='${novoCliente.cpf}';`
    );

    if (buscarCPF.rows.length !== 0) {
      response.status(409).send();
      return;
    }

    // inserir o novo cliente no BD
    await connection.query(
      `INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${novoCliente.name}', '${novoCliente.phone}', '${novoCliente.cpf}', '${novoCliente.birthday}');`
    );

    response.status(201).send();
  } catch (error) {
    response.status(500).send();
  }
}

export async function atualizarCliente(request, response) {
  try {
    // pegar o id passado na rota
    let { id } = request.params;
    id = parseInt(id);

    // pegar os dados do novo input
    const atualizarCliente = request.body;

    // verificar se o cpf é de um cliente existente, q não é o atual cliente, se for, emitir erro
    const { rows: buscarCPF } = await connection.query(
      `SELECT * FROM customers WHERE cpf='${atualizarCliente.cpf}';`
    );

    if (buscarCPF[0].id !== id) {
      if (buscarCPF.length !== 0) {
        response.status(409).send();
        return;
      }
    }

    // inserir o cliente atualizado no BD
    await connection.query(`
    UPDATE customers
    SET name = '${atualizarCliente.name}',
        phone = '${atualizarCliente.phone}',
        cpf = '${atualizarCliente.cpf}',
        birthday = '${atualizarCliente.birthday}'
    WHERE id=${id};
  `);

    response.status(200).send();
  } catch (error) {
    response.status(500).send();
  }
}
