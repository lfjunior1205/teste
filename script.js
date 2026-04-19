let carrinho = [];

function toggleTema() {
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('btn-tema');
    // Verifica a classe para decidir qual emoji mostrar
    if (document.body.classList.contains('dark-mode')) {
        btn.innerHTML = "☀️";
    } else {
        btn.innerHTML = "🌙";
    }
}

function abrirFecharCarrinho() {
    const carrinhoLateral = document.getElementById('carrinho-lateral');
    carrinhoLateral.classList.toggle('carrinho-hidden');
}

function adicionarAoCarrinho(nome, preco, temPromo = false, precoPromo = 0) {
    const itemEncontrado = carrinho.find(item => item.nome === nome);
    
    if (itemEncontrado) {
        // Bloqueia se tentar adicionar mais de 2 unidades em itens promocionais
        if (temPromo && itemEncontrado.quantidade >= 2) {
            alert("Limite máximo de 2 unidades para este produto promocional.");
            return;
        }
        itemEncontrado.quantidade += 1;
    } else {
        // Adiciona novo item com as informações de promoção
        carrinho.push({ 
            nome, 
            preco, 
            quantidade: 1, 
            temPromo: temPromo, 
            precoPromo: precoPromo 
        });
    }
    atualizarInterface();
}

function removerDoCarrinho(nome) {
    const itemEncontrado = carrinho.find(item => item.nome === nome);
    if (itemEncontrado) {
        itemEncontrado.quantidade -= 1;
        if (itemEncontrado.quantidade <= 0) {
            carrinho = carrinho.filter(item => item.nome !== nome);
        }
    }
    atualizarInterface();
}

function atualizarInterface() {
    const listaHtml = document.getElementById('lista-carrinho');
    const totalHtml = document.getElementById('valor-total');
    const contadorHtml = document.getElementById('contador-itens');
    
    let totalGeral = 0;
    let totalItens = 0;
    listaHtml.innerHTML = ''; 
    
    carrinho.forEach((item) => {
        let valorCalculado = 0;

        if (item.temPromo && item.quantidade === 2) {
            valorCalculado = item.precoPromo;
        } else {
            valorCalculado = item.preco * item.quantidade;
        }

        totalGeral += valorCalculado;
        totalItens += item.quantidade;

        const li = document.createElement('li');
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.alignItems = "center";
        li.style.marginBottom = "15px";
        li.style.gap = "10px"; // Espaço entre o texto e os botões

        li.innerHTML = `
            <div class="item-carrinho-info">${item.nome} (x${item.quantidade})</div>
            <div style="display: flex; gap: 5px; align-items: center; flex-shrink: 0;">
                <button class="btn-carrinho-menos" onclick="removerDoCarrinho('${item.nome}')">-</button>
                <button class="btn-carrinho-mais" onclick="adicionarAoCarrinho('${item.nome}', ${item.preco}, ${item.temPromo}, ${item.precoPromo})">+</button>
            </div>
        `;
        listaHtml.appendChild(li);
    });
    
    totalHtml.innerText = totalGeral.toFixed(2);
    contadorHtml.innerText = totalItens;
}

function finalizarPedido() {
    if (carrinho.length === 0) return alert("Carrinho vazio!");
    
    let mensagem = "*Pedido Silva Perfumes*%0A%0A";
    carrinho.forEach(item => {
        mensagem += `• ${item.quantidade}x ${item.nome}%0A`;
    });
    
    const total = document.getElementById('valor-total').innerText;
    mensagem += `%0A*Total a pagar: R$ ${total}*%0A%0A_Pedido feito pelo site._`;

    window.open(`https://wa.me/5516991172881?text=${mensagem}`, '_blank');
}