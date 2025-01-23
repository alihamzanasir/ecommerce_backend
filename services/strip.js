import Strip from "stripe";

const stripe = new Strip(process.env.STRIP_SECRET_KEY);

const stripFnc = async () => {
  try {
    await stripe.products
      .create({
        name: "Starter Subscription",
        description: "$12/Month subscription",
      })
      .then((product) => {
        stripe.prices
          .create({
            unit_amount: 1200,
            currency: "usd",
            recurring: {
              interval: "month",
            },
            product: product.id,
          })
          .then((price) => {
            console.log(
              "Success! Here is your starter subscription product id: " +
                product.id
            );
            console.log(
              "Success! Here is your starter subscription price id: " + price.id
            );
          });
      });
  } catch (error) {}
};
