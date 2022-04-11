import { Synths } from '@synthetixio/contracts-interface';
import { SwapWidget, Theme, TokenInfo } from '@uniswap/widgets';
import BaseModal from 'components/BaseModal';
import Connector from 'containers/Connector';
import { FC } from 'react';
import styled from 'styled-components';
import { getInfuraRpcURL } from 'utils/infura';

import DEFAULT_TOKEN_LIST from './defaultTokenList.json';

// special referece on the uniswap widget
// represents the Native Token of the current chain (typically ETH)
const NATIVE = 'NATIVE';

type UniswapModalProps = {
	onDismiss: () => void;
	isOpen?: boolean;
	tokenList?: TokenInfo[];
	inputTokenAddress?: string;
	outputTokenAddress?: string;
};

const theme: Theme = {
	primary: '#070A16',
	secondary: '#616677',
	interactive: '#C0C7DD',
	container: '#F4F6FE',
	module: '#DBE1F5',
	accent: '#C9975B',
	dialog: '#FFFFFF',
	fontFamily: 'Inter',
	borderRadius: 0.8,
	error: '#EF6868',
	// outline: '',
	// onAccent: '',
	// onInteractive: '',
	// hint: '',
	active: '#407CF8',
	success: '#1A9550',
	warning: '#EF6868',
	// tokenColorExtraction: true,
};

const UniswapModal: FC<UniswapModalProps> = ({
	isOpen = true,
	onDismiss,
	tokenList,
	inputTokenAddress,
	outputTokenAddress,
}) => {
	const { provider, network } = Connector.useContainer();
	const infuraRpc = getInfuraRpcURL(network.id);
	const normalizedTokenList = (tokenList || DEFAULT_TOKEN_LIST).filter(
		(t) => t.chainId === network.id
	);
	const OUTPUT_TOKEN_ADDRESS =
		outputTokenAddress || normalizedTokenList.find((t) => t.symbol === Synths.sUSD)?.address!;

	return (
		<StyledBaseModal onDismiss={onDismiss} isOpen={isOpen} title="">
			<div className="Uniswap">
				<SwapWidget
					theme={theme}
					provider={provider as any}
					jsonRpcEndpoint={infuraRpc}
					tokenList={normalizedTokenList}
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
		width: fit-content;
		display: flex;
		justify-content: center;
	}

	.card-header {
		display: none;
	}

	.card-body {
		padding: 0px;
		padding-top: 0px;
	}
`;
