import { accounts } from './accounts.js'

const divAccounts = document.getElementById('div-container-accounts')
const divSpending = document.getElementById('div-container-spending')
const navBar = document.getElementById('ul-nav')

divAccounts.addEventListener('click', (e) => {
    if (e.target.dataset.id) render(e.target.dataset.id)
})

navBar.addEventListener('click', (e) => {
    if (e.target.classList.contains('a-nav')) navigate(e.target)
})

const render = (selectedAccountID = 1) => {
    divAccounts.innerHTML = getAccountsHtml(accounts, +selectedAccountID)
    divSpending.innerHTML = getSpendingHtml(
        accounts.filter(acc => acc.id === +selectedAccountID)[0].spendings
    )
}

const getAccountsHtml = (accs, selectedAccountID) => {
    return accs.map(account => {
        const selected = account.id === selectedAccountID ? 'div-account-selected' : ''
        return `
            <div class="div-account ${selected}" data-id="${account.id}">
                <p class="p-account-name">${account.title}</p>
                <p>$ ${(+account.balance).toLocaleString()}</p>
            </div>
        `
    }).join('')
}

const getSpendingHtml = spendings => {
    if (spendings.length > 0) {
        const widthsAsPercentages = getWidths(spendings)
        return spendings.map((expense, index) => {
            return `
                <div class="spending-bar" style="width:${widthsAsPercentages[index]}">
                    <p class="p-spending-name">${expense.category}</p>
                    <p>$ ${(+expense.spent).toLocaleString()}</p>
                </div>
            `
        }).join('')
    } else {
        return `<p class="no-expenses">You haven't spent anything from this account 🤑</p>`
    }
}

const getWidths = spendings => {
    const spends = spendings.map(spend => spend.spent)
    const highestSpend = Math.ceil(...spends)
    return spends.map(spend => {
        return `${getWidthAsPercentage(spend, highestSpend, 50)}%`
    })
}

const getWidthAsPercentage = (spend, maxSpend, minWidth) => {
    return Math.round((minWidth) + ((minWidth + (100 - (minWidth * 2))) * (spend / maxSpend)))
}

const navigate = (target) => {
    const existingSelection = document.querySelectorAll('.a-nav-selected')
    if (existingSelection.length > 0) 
        existingSelection.forEach(
            el => el.classList.remove('a-nav-selected')
        )
    target.classList.add('a-nav-selected')
}

render()