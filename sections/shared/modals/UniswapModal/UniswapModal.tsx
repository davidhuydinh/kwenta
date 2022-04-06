import { Synths } from '@synthetixio/contracts-interface';
import { SwapWidget, TokenInfo } from '@uniswap/widgets';
import BaseModal from 'components/BaseModal';
import Connector from 'containers/Connector';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getInfuraRpcURL } from 'utils/infura';

// special referece on the uniswap widget
// represents the Native Token of the current chain (typically ETH)
const NATIVE = 'NATIVE';

const DEFAULT_TOKEN_LIST: TokenInfo[] = [
	{
		chainId: 69,
		address: '0xaA5068dC2B3AADE533d3e52C6eeaadC6a8154c57',
		name: 'Synthetix USD',
		symbol: 'sUSD',
		decimals: 18,
		logoURI:
			'https://raw.githubusercontent.com/Synthetixio/synthetix-assets/v2.0.12/synths/sUSD.svg',
	},
	{
		chainId: 10,
		address: '0x8c6f28f2F1A3C87F0f938b96d27520d9751ec8d9',
		name: 'Synthetix USD',
		symbol: 'sUSD',
		decimals: 18,
		logoURI:
			'https://raw.githubusercontent.com/Synthetixio/synthetix-assets/v2.0.12/synths/sUSD.svg',
	},
	{
		chainId: 1,
		address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
		symbol: 'sUSD',
		name: 'Synth US Dollars',
		decimals: 18,
		logoURI:
			'https://raw.githubusercontent.com/Synthetixio/synthetix-assets/v2.0.12/synths/sUSD.svg',
		tags: ['synth'],
	},
];

type UniswapModalProps = {
	onDismiss: () => void;
	tokenList?: TokenInfo[];
	inputTokenAddress?: string;
	outputTokenAddress?: string;
};

const UniswapModal: FC<UniswapModalProps> = ({
	onDismiss,
	tokenList,
	inputTokenAddress,
	outputTokenAddress,
}) => {
	const { t } = useTranslation();
	const { provider, network } = Connector.useContainer();

	const infuraRpc = getInfuraRpcURL(network.id);
	const TOKEN_LIST = tokenList || DEFAULT_TOKEN_LIST.filter((t) => t.chainId === network.id);
	const OUTPUT_TOKEN_ADDRESS =
		outputTokenAddress || TOKEN_LIST.find((t) => t.symbol === Synths.sUSD)?.address!;

	return (
		<StyledBaseModal onDismiss={onDismiss} isOpen={true} title={t('modals.uniswap-widget.title')}>
			<div className="Uniswap">
				<SwapWidget
					provider={provider as any}
					jsonRpcEndpoint={infuraRpc}
					tokenList={TOKEN_LIST}
					defaultInputTokenAddress={inputTokenAddress || NATIVE}
					defaultOutputTokenAddress={OUTPUT_TOKEN_ADDRESS}
					onError={(error, info) => console.error(error, info)}
				/>
			</div>
		</StyledBaseModal>
	);
};

export default UniswapModal;

const StyledBaseModal = styled(BaseModal)`
	[data-reach-dialog-content] {
		display: flex;
		justify-content: center;
	}

	.card-body {
		padding: 10px;
	}

	.card-body {
		padding: 25px;
		padding-top: 0px;
	}
`;
