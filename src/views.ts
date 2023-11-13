import {FORWARDS, START} from '@eventstore/db-client'
import {client as eventStore} from './eventstore'

interface Purchase {
  purchaseId: string
  name: string
  amount: number
  wasRefunded: boolean
}

// OOP Version of the code

const getAllPurchases = async () => {
  const purchases: Purchase[] = []

  const events = eventStore.readAll({
    direction: FORWARDS,
    fromPosition: START,
    maxCount: 1000,
  })

  for await (const {event} of events) {
    const data: any = event.data

    switch (event?.type) {
      case 'ProductPurchased':
        purchases.push({
          purchaseId: data.purchaseId,
          amount: data.amount,
          name: data.name,
          wasRefunded: false,
        })
        break

      case 'ProductRefunded':
        const purchase = getPurchaseById(purchases, data.purchaseId)
        if (purchase) {
          purchase.wasRefunded = true
        }
        break
    }
  }

  return purchases
}

function getPurchaseById(purchases: Purchase[], purchaseId: string) {
  return purchases.find((p: Purchase) => p.purchaseId === purchaseId)
}

export {getAllPurchases, Purchase}
