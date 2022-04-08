import { Synths } from '@synthetixio/contracts-interface';
import { Theme, SwapWidget, TokenInfo } from '@uniswap/widgets';
import BaseModal from 'components/BaseModal';
import Connector from 'containers/Connector';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { getInfuraRpcURL } from 'utils/infura';
import DEFAULT_TOKEN_LIST from './defaultTokenList.json';

// special referece on the uniswap widget
// represents the Native Token of the current chain (typically ETH)
const NATIVE = 'NATIVE';

type UniswapModalProps = {
	onDismiss: () => void;
	isOpen: boolean;
	tokenList?: TokenInfo[];
	inputTokenAddress?: string;
	outputTokenAddress?: string;
};

const theme: Theme = {
	primary: '#070A16',
	secondary: '#616677',
	interactive: '#C9975B',
	container: '#F4F6FE',
	module: '#DBE1F5',
	accent: '#C9975B',
	dialog: '#070A16',
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
};

const UniswapModal: FC<UniswapModalProps> = ({
	isOpen,
	onDismiss,
	tokenList,
	inputTokenAddress,
	outputTokenAddress,
}) => {
	const { t } = useTranslation();
	const { provider, network } = Connector.useContainer();
	console.log(DEFAULT_TOKEN_LIST);
	const infuraRpc = getInfuraRpcURL(network.id);
	const TOKEN_LIST = tokenList || DEFAULT_TOKEN_LIST.filter((t) => t.chainId === network.id);
	const OUTPUT_TOKEN_ADDRESS =
		outputTokenAddress || TOKEN_LIST.find((t) => t.symbol === Synths.sUSD)?.address!;

	return (
		<StyledBaseModal onDismiss={onDismiss} isOpen={isOpen} title="">
			<div className="Uniswap">
				<SwapWidget
					theme={theme}
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

	.card-header {
		display: none;
	}

	.card-body {
		padding: 0px;
		padding-top: 0px;
	}
`;
