// Read from state to verify data integrity
import { HttpAgent, Certificate, Cbor } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { PrincipalString } from '@/ic/common/icType';
const encoder = new TextEncoder();
const encode = (arg: string): ArrayBuffer => {
  return new DataView(encoder.encode(arg).buffer).buffer;
};
export const readState = async (
  canisterId: PrincipalString
): Promise<void | {
  controllers: Array<PrincipalString>;
  moduleHash: string;
}> => {
  const canisterBuffer = new DataView(
    Principal.from(canisterId).toUint8Array().buffer
  ).buffer;
  const agent = new HttpAgent({ host: 'https://ic0.app' });
  const pathControllers = [
    encode('canister'),
    canisterBuffer,
    encode('controllers')
  ];
  const pathHash = [encode('canister'), canisterBuffer, encode('module_hash')];
  let res;
  const paths = [pathControllers, pathHash];
  try {
    res = await agent.readState(canisterId, {
      paths: paths
    });
  } catch (error) {
    console.warn('read_state:', error);
    return {
      controllers: [],
      moduleHash: '-'
    };
  }
  console.log(res);
  // @ts-ignore
  const cert = await Certificate.create({
    certificate: res.certificate,
    rootKey: agent.rootKey,
    canisterId: Principal.from(canisterId)
  });
  console.log(cert);
  let certControllerIds;
  let moduleHash = '-';
  let controllers = [];
  try {
    const certControllers = cert.lookup(pathControllers);
    controllers = (Cbor.decode(certControllers) as Array<Buffer>).map(
      (buf: Buffer) => Principal.fromUint8Array(buf).toText()
    );
  } catch (e) {
    console.log(e);
    controllers = [];
  }
  try {
    const certHash = cert.lookup(pathHash);
    moduleHash = [...new Uint8Array(certHash)]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('');
  } catch (e) {
    console.log(e);
    moduleHash = '-';
  }
  console.log(controllers);
  console.log(moduleHash);
  return {
    controllers: controllers,
    moduleHash: moduleHash
  };
  // const cert: Certificate = new Certificate(res, agent);
  // if (await cert.verify()) {
  //   let certControllerIds;
  //   let moduleHash;
  //   try {
  //     const certControllers = cert.lookup(pathControllers);
  //     certControllerIds = (Cbor.decode(certControllers) as Array<Buffer>).map(
  //       (buf: Buffer) => Principal.fromUint8Array(buf).toText()
  //     );
  //   } catch (e) {
  //     console.log(e);
  //     return {
  //       controllers: [],
  //       moduleHash: '-'
  //     };
  //   }
  //   try {
  //     moduleHash = Buffer.from(cert.lookup(pathModuleHash))?.toString('hex');
  //   } catch (e) {
  //     console.log(e);
  //     return {
  //       controllers: [],
  //       moduleHash: '-'
  //     };
  //   }
  //   return {
  //     controllers: certControllerIds,
  //     moduleHash: moduleHash
  //   };
  // }
};
