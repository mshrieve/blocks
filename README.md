# BLOCKS


blocks is a project I made for ETHglobal's hackMoney hackathon.

you can watch my video submission on youtube if you like:
https://www.youtube.com/watch?v=ukqOrri8E7M


blocks allows users to buy erc1155 tokens that correspond to _buckets_.
a bucket is a discrete price range of a particular asset.
for a given round, if the asset's price falls in the corresponding bucket at expiry, 
that token can be exchanged for 1 USDC (or whichever 'stable' asset you use to price the main asset).

the price of each bucket is dynamically adjusted during the round according to the so-called Log Market Scoring Rule (LMSR).
the sum of the prices across all buckets is always equal to 1, since one of the bucket's tokens will always be redeemable for 1.
in other words, buying 1 of each bucket's tokens guarantees a payout of 1 at expiry.

_speculators_ are incentivized to purchase the buckets in ranges where they believe the price will fall, 
as long as the price of those buckets is not too close to 1.

_hedgers_ are incentivized to purchase ranges _away_ from where the believe the price will fall,
assuming that they are long the asset

speculators help keep prices low for hedgers, and vice-versa

in this way, blocks serves as a _prediction market_ for the price of the asset,
providing information on the future price of the asset.

three types of 'bundles' of buckets can be easily purchased:

i) a fixed quantity of all buckets above or below a given price.
these bundles have a payout that is equivalent to a so-called binary, or digital option.

ii) a fixed quantity of all buckets in a given range.
the payout of these bundles is equivalent to a binary option _spread_.

ii) a linearly increasing quantity of all buckets above or below a given price.
these bundles have a payout that closely approximates, but is not _quite_ equal to, a traditional call or put option.

get in touch with me at mike@loset.info or on discord @ loset#0786 with any questions, suggestions, if you would like to read a draft of the whitepaper, or for any other reason :)

on-going progress is in a private repo, for now... :D
