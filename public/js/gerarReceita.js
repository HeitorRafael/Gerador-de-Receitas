async function generateRecipe(tipo) {
    let body = {};

    if (tipo === 'nomeRceita') {
        const nomeReceita = document.getElementById('nomeReceita').value;
        body = { nomeReceita };
    } else if (tipo === 'ingredientes') {
        const ingredientes = document.getElementById('ingredientes').value;
        body = { ingredientes };
    }
    else if (tipo === 'aleatorio') {
        body = { aleatorio: true };
    }
    try {
        const response = await fetch('http://localhost:3000/generate-recipe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Erro ao gerar receita');
        }

        const data = await response.json();
        document.getElementById('receitaGerada').innerText = data.receitaGerada;
        const receitaContainer = `
            <div>
                <pre>${data.receita}</pre>
                <img src="${data.imagem}" alt="Imagem da Receita" style="width:300px; margin-top: 20px; border-radius: 10px;" />
            </div>
        `;
        document.getElementById('receitaGerada').innerHTML = receitaContainer;
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao gerar receita. Por favor, tente novamente.');
    }
}
