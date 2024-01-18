

const getKeeper = () => {
    const keeper = (window as any).KeeperWallet || (window as any).WavesKeeper;

    if (!keeper) {
        throw new Error('Install keeper');
    }

    return keeper;
}

export const keeperLogin = async () => {

    const state = await getKeeper().publicState();
    let networkSett = {} as { code: string, matcher: string, server: string };
    let user = null;
    let userName = null;
    try {
        const {account, network} = state;
        const {address, name} = account;
        const {code, matcher, server} = network as { code: string, matcher: string, server: string };
        networkSett = { code, matcher, server };
        user = address;
        userName = name;
    } catch (e) {
        throw new Error(`Can't login. Check keeper access.`);
    }
    if (networkSett.code !== "W") {
        throw new Error('Switch to mainnet accounts');
    }

    return { user, userName, ...networkSett };
};

export const claim = async (nodeUrl: string, vestingContract: string) => {
    const keeper = getKeeper();
    await keeper.signAndPublishTransaction({
        type: 16,
        data: {
            fee: {
                tokens: '0.05',
                assetId: 'WAVES',
            },
            dApp: vestingContract,
            call: {
                function: 'claimAll',
                args: [
                ],
            },
            payment: [],
        }});
};