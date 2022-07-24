import connection from "../dbStrategy/postgres.js";

export async function listarClientes(request, response) {
  // buscar todas as categorias no BD e enviá-las para o front
  const clientes = await connection.query("SELECT * FROM customers");

  response.send(clientes.rows);
}

export async function listarClienteId(request, response) {
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
}

export async function inserirCliente(request, response) {
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
}

export async function atualizarCliente(request, response) {
  // pegar o id passado na rota
  const { id } = request.params;

  // pegar os dados do novo input
  const atualizarCliente = request.body;

  console.log(atualizarCliente);

  // inserir a nova categoria no BD
  //await connection.query(`UPDATE customers SET name=${atualizarCliente.name}, phone=${atualizarCliente.phone}, cpf=${atualizarCliente.cpf}, name=${atualizarCliente.birthday} WHERE id=$1`,[id]);

  response.status(200).send();
}
