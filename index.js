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
        // widthsAsPercentages is, as you might suspect, an array of percentages corresponding to each 'spend'
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

// getWidths takes in an array of spendings retrieved from from accounts.js, and calculates the percentage of
// each 'spend' relative to the highest spend in the set (the highest spend will be treated as '100%')
// So, simplified, if you passed in [50, 25, 12.5] as the spendings, it will return an array [100, 50, 25] (these
// represent percentages
const getWidths = spendings => {
    // Create an array from the individual 'spends'
    const spends = spendings.map(spend => spend.spent)
    // Get the highest 'spend'
    const highestSpend = Math.ceil(...spends)
    // Create the array of percentages
    return spends.map(spend => {
        return `${getWidthAsPercentage(spend, highestSpend, 50)}%`
    })
}

// Returns a percentage. Takes three arguments:
// — 'spend' is self explanatory
// — 'maxSpend' is the maximum spend from the set, calculated as 'highestSpend' in getWidths()
// — 'minWidth' allows us to constrain the result to say, a minimum of 50%. We need this because
// otherwise given a range where there is a large spend of 1000 and a smallest spend of 10, 
// the resulting 'spending bar' will be too small and the text will overflow. minWidth
// means we can say 'I want the smallest bar to be no smaller than 50% or 30% or whatever'...and
// it will behave itself! 
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
