<sup>Esse é um feedback gerado por IA, ele pode conter erros.</sup>

Você tem 6 créditos restantes para usar o sistema de feedback AI.

# Feedback para Leo-Avelar:

Nota final: **86.0/100**

Olá, Leo-Avelar! 👋🚀

Primeiramente, parabéns pelo esforço e pelo ótimo trabalho na construção da sua API para o Departamento de Polícia! 🎉 Você conseguiu implementar a maior parte dos endpoints essenciais, com uma organização modular bacana entre rotas, controladores e repositories, e ainda mandou bem nos filtros e ordenações — isso é um diferencial e mostra que você está indo além do básico. Vamos juntos analisar seu código para deixar ele ainda mais afiado, ok? 😉

---

### 🎯 O que você fez muito bem

- Sua estrutura de pastas está perfeita e segue exatamente o que o desafio pede: `routes/`, `controllers/`, `repositories/`, `utils/`, `docs/` e o `server.js` na raiz. Isso é essencial para manter o projeto organizado e escalável. 👏

- Você implementou todos os métodos HTTP para os recursos `/agentes` e `/casos`, incluindo os métodos PUT, PATCH, DELETE, o que é ótimo!

- A validação dos dados com `zod` está presente e bem aplicada na maior parte do código, garantindo que payloads mal formatados sejam rejeitados.

- O tratamento de erros com a classe `ApiError` está muito bem pensado, facilitando o controle centralizado dos erros.

- Você implementou filtros e ordenação para os agentes e casos, o que mostra que você entendeu bem como manipular dados em memória.

- Bônus conquistados: filtros por status e agente nos casos, além do endpoint para buscar agente responsável por um caso (embora com alguns ajustes que vamos falar). Isso é muito legal! 🎉

---

### 🔍 Pontos para melhorar (e que vão turbinar sua API!)

#### 1. **Falha ao impedir alteração do ID nas atualizações (PUT e PATCH)**

Eu percebi que você está permitindo que o campo `id` seja alterado ao atualizar agentes e casos, o que não é desejado. O ID deve ser imutável, pois é o identificador único do recurso.

No seu código do controlador de agentes, por exemplo:

```js
const update = (req, res, next) => {
	try {
		const { id } = req.params;
		const data = agenteSchema.parse(req.body);
		delete data.id; // aqui você tenta remover o id do payload
		const updated = agentesRepository.update(id, data);
		// ...
	} catch (error) {
		next(error);
	}
}
```

Mas, ao usar `delete data.id` **após** a validação do schema, o `zod` já terá validado o `id` como um campo permitido, e se o cliente enviar um `id` diferente, isso não é barrado na validação.

**O problema fundamental é que seu schema aceita o campo `id` para atualização, e a validação não deve permitir que ele seja passado.**

**Solução:**

- Ajuste seus schemas `agenteSchema` e `casoSchema` para que o campo `id` seja omitido ou marcado como `optional` e proibido na validação de atualização (PUT e PATCH).

- Ou crie schemas separados para criação e atualização, onde o `id` não seja permitido no corpo da requisição.

Assim, o erro já será detectado na validação, e você evita tentar deletar manualmente o `id` depois.

---

#### 2. **Falha ao retornar status 400 ao atualizar parcialmente um agente com payload inválido**

Você mencionou que ao fazer PATCH em agentes com payload incorreto, não está recebendo o status 400 esperado.

Analisando o método `partialUpdate` em `agentesController.js`:

```js
const partialUpdate = (req, res, next) => {
	try {
		const { id } = req.params;
		const data = agenteSchema.partial().parse(req.body);
		delete data.id;
		const updatedAgente = agentesRepository.update(id, data);
		if (!updatedAgente) throw new ApiError('Agente não encontrado.', 404);
		res.status(200).json(updatedAgente);
	} catch (error) {
		next(error);
	}
}
```

Aqui, você está usando `agenteSchema.partial().parse(req.body)` para validar o corpo parcial, o que é correto. Porém, se o `req.body` estiver em formato incorreto (exemplo: campo com tipo errado), o `parse` deve lançar um erro e cair no `catch`.

**Por que o status 400 pode não estar vindo?**

- Pode ser que o seu middleware `errorHandler` (em `utils/errorHandler.js`) não esteja tratando corretamente os erros de validação do `zod` para retornar 400.

- Ou o erro lançado pelo `zod` não está sendo identificado e convertido para status 400.

**Dica:**

No seu `errorHandler`, certifique-se de detectar erros de validação do `zod` e responder com status 400 e mensagem adequada.

Exemplo simplificado:

```js
function errorHandler(err, req, res, next) {
  if (err.name === 'ZodError') {
    return res.status(400).json({ message: err.errors.map(e => e.message).join(', ') });
  }
  // outras tratativas...
}
```

---

#### 3. **Falha ao retornar status 404 ao tentar criar caso com agente_id inválido**

No seu `casosController.js`, você tem uma função `verifyAgente` que verifica se o `agente_id` passado existe:

```js
const verifyAgente = (agenteId) => {
    if (!agenteId) return false;
    const agente = agentesRepository.findById(agenteId);
    return !!agente;
};
```

E no método `create`:

```js
const create = (req, res, next) => {
    try {
        const data = casoSchema.parse(req.body);
		if (!verifyAgente(data.agente_id)) {
			throw new ApiError('Agente informado não existe.', 400);
		}

        const newCaso = casosRepository.create(data);
        res.status(201).json(newCaso);
    } catch (error) {
        next(error);
    }
}
```

Aqui, você está retornando status **400** (Bad Request) quando o `agente_id` não existe. Porém, o correto, segundo boas práticas REST e o enunciado, é retornar **404 Not Found** para recursos relacionados que não existem.

Ou seja, se o `agente_id` informado não existe, o erro deve ser 404, não 400.

**Como corrigir:**

Altere o lançamento do erro para:

```js
throw new ApiError('Agente informado não existe.', 404);
```

Esse ajuste deve ser aplicado também nos métodos de update e patch de casos, onde você verifica o `agente_id`.

---

#### 4. **Endpoint GET /casos/:id/agente não está funcionando corretamente**

Você implementou a rota no `casosRoutes.js`:

```js
router.get('/:id/agente', controller.getAgenteOfCaso);
```

E o método no controller:

```js
const getAgenteOfCaso = (req, res, next) => {
	try {
		const { id } = req.params;
		const caso = casosRepository.findById(id);
		if (!caso) return next(new ApiError('Caso não encontrado.', 404));

		const agente = agentesRepository.findById(caso.agente_id);
		if (!agente) return next(new ApiError('Agente não encontrado.', 404));

		res.status(200).json(agente);
	} catch (error) {
		next(new ApiError("Erro ao buscar agente do caso"));
	}
}
```

A lógica está correta! Porém, notei que na definição das rotas em `casosRoutes.js`, você colocou essa rota **depois** das rotas com `/:id`:

```js
router.get('/search', controller.search);
router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.get('/:id', controller.getById);
router.delete('/:id', controller.delete);
router.patch('/:id', controller.partialUpdate);
router.get('/:id/agente', controller.getAgenteOfCaso);
```

Isso pode causar conflito, pois o Express interpreta as rotas na ordem em que são declaradas. O `/:id` é genérico e pode "engolir" o `/:id/agente`, fazendo com que a rota para buscar o agente nunca seja chamada.

**Solução:**

Coloque a rota mais específica (`/:id/agente`) **antes** da rota genérica `/:id`, assim:

```js
router.get('/search', controller.search);
router.get('/', controller.getAll);
router.post('/', controller.create);
router.get('/:id/agente', controller.getAgenteOfCaso); // mover para cima
router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.patch('/:id', controller.partialUpdate);
router.delete('/:id', controller.delete);
```

Isso garante que o Express verifique primeiro a rota específica e só depois a genérica.

---

#### 5. **Filtro por keywords na busca de casos não está implementado corretamente**

Você tem o endpoint `/casos/search` e no controller:

```js
const search = (req, res, next) => {
	try {
		let casos = casosRepository.findAll();
		if (req.query.q) {
			const keyword = req.query.q.toLowerCase();
			casos = casos.filter(c => c.titulo.toLowerCase().includes(keyword) || c.descricao.toLowerCase().includes(keyword));
		}
		res.status(200).json(casos);
	} catch (error) {
		next(new ApiError("Erro ao buscar casos"));
	}
}
```

A lógica está correta e bem implementada! Porém, no arquivo de rotas, o endpoint está declarado corretamente? Sim, está:

```js
router.get('/search', controller.search);
```

Então o problema pode estar relacionado à ordem das rotas (como no item anterior) ou à forma como os testes esperam o resultado.

Se você já corrigiu a ordem das rotas, isso deve funcionar. Caso contrário, recomendo testar bastante esse endpoint.

---

### 📚 Recursos para você aprofundar ainda mais

- Para garantir validações robustas e evitar que o `id` seja alterado no PUT/PATCH, recomendo este vídeo que ensina boas práticas com validação em APIs Node.js/Express usando Zod:  
  https://youtu.be/yNDCRAz7CM8?si=Lh5u3j27j_a4w3A_

- Para entender melhor como organizar suas rotas e evitar conflitos entre rotas específicas e genéricas, confira a documentação oficial do Express sobre roteamento:  
  https://expressjs.com/pt-br/guide/routing.html

- Se quiser revisar sobre códigos de status HTTP e quando usar cada um (400 vs 404), esse artigo é excelente:  
  https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/400  
  https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status/404

- Para reforçar a manipulação de arrays e filtros, esse vídeo pode ajudar muito:  
  https://youtu.be/glSgUKA5LjE?si=t9G2NsC8InYAU9cI

---

### 📝 Resumo rápido para focar

- ❌ Ajustar schemas para impedir alteração do campo `id` em PUT e PATCH (criar schemas separados para criação e atualização).

- ❌ Garantir que o middleware de tratamento de erros converta erros de validação do Zod em status 400.

- ❌ Corrigir o status retornado ao criar/atualizar caso com `agente_id` inválido para 404 (não 400).

- ❌ Reorganizar rotas em `casosRoutes.js` para colocar rotas específicas (`/:id/agente`) antes das genéricas (`/:id`).

- ✅ Validar e testar o endpoint de busca `/casos/search` para garantir que funciona como esperado.

---

Leo, você está no caminho certo e já construiu uma API sólida! 💪 Com esses ajustes, sua aplicação vai ficar ainda mais robusta e alinhada com as melhores práticas. Continue praticando, revisando e explorando cada detalhe — isso fará de você um desenvolvedor cada vez melhor! 🚀✨

Se precisar de ajuda para implementar qualquer um desses pontos, me chama aqui que a gente resolve junto! 😉

Abraço e sucesso! 👊🔥

> Caso queira tirar uma dúvida específica, entre em contato com o Chapter no nosso [discord](https://discord.gg/DryuHVnz).



---
<sup>Made By the Autograder Team.</sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Carvalho](https://github.com/ArthurCRodrigues)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Arthur Drumond](https://github.com/drumondpucminas)</sup></sup><br>&nbsp;&nbsp;&nbsp;&nbsp;<sup><sup>- [Gabriel Resende](https://github.com/gnvr29)</sup></sup>