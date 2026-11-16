# StudyFlow — Painel de Organização de Estudos

Um painel web responsivo para organizar tarefas acadêmicas, acompanhar prazos e visualizar o progresso dos estudos. Desenvolvido com HTML, CSS e JavaScript puro, sem dependências de frameworks.

## Funcionalidades

- Cadastro, edição e exclusão de tarefas.
- Organização por matéria e prazo.
- Definição de prioridade alta, média ou baixa.
- Marcação de tarefas como concluídas.
- Filtros por matéria e status.
- Pesquisa por nome da tarefa ou matéria.
- Indicadores de tarefas totais, pendentes, concluídas e percentual de progresso.
- Salvamento automático no `localStorage` do navegador.
- Layout responsivo para celular, tablet e computador.
- Interface acessível com rótulos, mensagens de status e suporte a teclado.

## Tecnologias

- **HTML5** — estrutura semântica.
- **CSS3** — layout responsivo e componentes visuais.
- **JavaScript (ES6+)** — lógica, manipulação do DOM e eventos.
- **Web Storage API** — persistência local no navegador.

## Como executar

Não é necessário instalar dependências.

1. Faça o clone do repositório:
   ```bash
   git clone https://github.com/gabrielle-software/painel-organizacao-estudos.git
   ```
2. Abra a pasta do projeto.
3. Abra o arquivo `index.html` em um navegador atualizado.

Também é possível utilizar a extensão Live Server no Visual Studio Code para executar o projeto em um servidor local.

## Estrutura

```text
painel-organizacao-estudos/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Armazenamento e privacidade

As tarefas são salvas no armazenamento local (`localStorage`) do navegador utilizado. Os dados não são enviados para um servidor. Limpar os dados do navegador pode apagar as tarefas salvas; por isso, evite utilizar o projeto como único registro de informações importantes.

## English

StudyFlow is a responsive web dashboard for managing academic tasks, tracking due dates, and monitoring study progress. It is built with plain HTML, CSS, and JavaScript, with no framework dependencies.

### Features

- Create, edit, and delete study tasks.
- Organize tasks by subject and due date.
- Set high, medium, or low priority.
- Mark tasks as completed.
- Filter by subject and status.
- Search by task title or subject.
- Track total, pending, completed tasks, and overall progress.
- Automatically save data in browser `localStorage`.
- Responsive layout for mobile, tablet, and desktop.

### Technologies

HTML5, CSS3, JavaScript (ES6+), and the Web Storage API.

### Run locally

Clone the repository and open `index.html` in a modern browser. No dependencies or build tools are required.

### Data storage

Tasks are stored locally in the browser using `localStorage`. No data is sent to a server.

---

**Author:** Gabrielle Sousa  
**Portfolio:** [GitHub profile](https://github.com/gabrielle-software)  
**LinkedIn:** [Gabrielle Sousa](https://www.linkedin.com/in/gabrielle-lima-895493323/)
