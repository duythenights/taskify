import { db } from "@/lib/db"
import { stripe } from "@/lib/stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(req:Request){
    const body = await req.text()
    const signature = headers().get("Stripe-Signature") as string

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        )
    }
    catch {
        return new NextResponse("Webhook error", {status: 400})
    }


    const session = event.data.object as Stripe.Checkout.Session;

    console.log('a')

    if(event.type === "checkout.session.completed"){
        console.log('b')
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

        if(!session.metadata?.orgId){
            return new NextResponse("Org ID is required.", {status:400})
        }

        await db.orgSubscription.create({
            data: {
                orgId: session.metadata.orgId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                )
            }
        })
    }


    if(event.type === "invoice.payment_succeeded"){
        console.log('c')
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        )

        await db.orgSubscription.update({
            where:{
                stripeSubscriptionId: subscription.id

            },
            data: {
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(
                    subscription.current_period_end * 1000
                )
            }
        })
    }
    console.log('d')


    return new NextResponse(null, {status:200})
}