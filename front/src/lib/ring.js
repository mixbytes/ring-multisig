import * as BigInteger from 'jsproover-mixbytes/prover/bigInteger/bigInteger';
import { ECCurve } from 'jsproover-mixbytes/prover/curve/curve';

const secureRandom = require("secure-random");
const BN = require("bn.js");
const ethereumjs_util = require("ethereumjs-util");

function getRingSignature (message, ringdata) {
  const bnCurve = new ECCurve('bn256')
  const order = bnCurve.order
  const signatureGenerator = bnCurve.generator

  const N_signer = ringdata.privkeyindex
  let pk = new BigInteger.BNCLASS(ringdata.privkey.substr(2), 16, 'be')
  pk = pk.umod(order)

  // [FIXME] - remove trash with substr
  // let message = "0x14462573adecc6b213bfd0290aea56d908c2b491d3a26b1e35febceb9153c784";
  let hashp = bnCurve.hashInto(message.substr(2))

  // Calculate Tau
  let hashSP = hashp.mul(pk)
  // await l(hashSP.serialize(true));

  let hash_acc = ethereumjs_util.sha256(Buffer.concat([hashp.serialize(true).slice(0, 32), hashSP.serialize(true)]))

  let csum = new BigInteger.BNCLASS(0, 16, 'be')
  let gen = bnCurve.generator

  let ctlist = []
  let a = bnCurve.zero
  let b
  let ri

  for (let j = 0; j < ringdata.pubkeys.length; j++) {
    if (j != N_signer) {
      let data = secureRandom(32, {type: 'Buffer'})
      let cj = new BN(data, 16, 'be')
      data = secureRandom(32, {type: 'Buffer'})
      let tj = new BN(data, 16, 'be')

      // ParameterPointAdd returns the addition of c scaled by cj and tj as a curve poinT
      let p1 = gen.mul(tj)
      let pubk = bnCurve.pointFromCoordinates(ringdata.pubkeys[j].x.substr(2), ringdata.pubkeys[j].y.substr(2))
      let p2 = pubk.mul(cj)
      a = p1.add(p2)

      // HashPointAdd returns the addition of hashSP scaled by cj and c scaled by tj
      let p3 = hashp.mul(tj)
      let p4 = hashSP.mul(cj)
      b = p3.add(p4)

      ctlist.push(cj)
      ctlist.push(tj)

      csum = csum.add(cj)
    }

    if (j == N_signer) {
      let zero = new BigInteger.BNCLASS(0, 16, 'be')
      ctlist.push(zero)
      ctlist.push(zero)

      // [TEMP] [FIXME] GENERATE RANDOM ri!!
      let data = secureRandom(32, {type: 'Buffer'})
      let ri = new BN(data, 16, 'be')
      a = gen.mul(ri)
      b = hashp.mul(ri)
    }

    hash_acc = ethereumjs_util.sha256(Buffer.concat([hash_acc, a.serialize(true), b.serialize(true)]))
  }

  // [TODO] remove unneeded "umods"
  let hashb = new BN(hash_acc, 16, 'be')
  hashb = hashb.umod(order)

  csum = csum.umod(order)

  let c = new BN(hashb, 16, 'be')
  c = c.sub(csum).umod(order)

  let cx = new BN(c, 16, 'be')
  cx = cx.mul(pk)
  cx = cx.umod(order)

  let ti = new BN(ri, 16, 'be')
  ti = ti.sub(cx)
  ti = ti.umod(order)

  ctlist[2 * N_signer] = c
  ctlist[2 * N_signer + 1] = ti

  let x = '0x' + hashSP.serialize(true).slice(0, 32).toString('hex')
  let y = '0x' + hashSP.serialize(true).slice(32, 64).toString('hex')

  let ctlist_hex = []
  for (let i = 0; i < ctlist.length; i++) {
    ctlist_hex[i] = '0x' + ctlist[i].toString('hex')
  }
  return {'tau': {'x': x, 'y': y}, 'ctlist': ctlist_hex}
}
