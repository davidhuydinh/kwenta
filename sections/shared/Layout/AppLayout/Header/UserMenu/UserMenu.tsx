import { FC, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import Connector from 'containers/Connector';

import Button from 'components/Button';

import { isWalletConnectedState } from 'store/wallet';
import { FlexDivCentered } from 'styles/common';

import SettingsModal from 'sections/shared/modals/SettingsModal';

import NetworksSwitcher from '../NetworksSwitcher';
import WalletActions from '../WalletActions';
import ConnectionDot from '../ConnectionDot';
import useGetFuturesMarkets from 'queries/futures/useGetFuturesMarkets';
import useGetFuturesPositionForMarkets from 'queries/futures/useGetFuturesPositionForMarkets';
import UniswapModal from 'sections/shared/modals/UniswapModal';
import BalanceActions from '../BalanceActions';

const UserMenu: FC = () => {
	const { t } = useTranslation();
	const isWalletConnected = useRecoilValue(isWalletConnectedState);
	const { connectWallet } = Connector.useContainer();
	const [settingsModalOpened, setSettingsModalOpened] = useState<boolean>(false);
	const [uniswapWidgetOpened, setUniswapWidgetOpened] = useState<boolean>(false);

	const futuresMarketsQuery = useGetFuturesMarkets();
	const futuresMarkets = futuresMarketsQuery?.data ?? [];
	const futuresPositionQuery = useGetFuturesPositionForMarkets(
		futuresMarkets.map(({ asset }) => asset)
	);
	const futuresPositions = futuresPositionQuery?.data ?? [];

	return (
		<>
			<Container>
				<FlexDivCentered>
					{isWalletConnected && (
						<BalanceActions
							futuresPositions={futuresPositions}
							setShowUniswapWidget={setUniswapWidgetOpened}
						/>
					)}
					{isWalletConnected && <NetworksSwitcher />}
					{isWalletConnected ? (
						<WalletActions />
					) : (
						<ConnectButton
							size="sm"
							variant="outline"
							onClick={connectWallet}
							data-testid="connect-wallet"
							mono
						>
							<StyledConnectionDot />
							{t('common.wallet.connect-wallet')}
						</ConnectButton>
					)}
					{isWalletConnected && (
						<MenuButton
							onClick={() => {
								setSettingsModalOpened(!settingsModalOpened);
							}}
							isActive={settingsModalOpened}
						>
							<SettingsText>...</SettingsText>
						</MenuButton>
					)}
				</FlexDivCentered>
			</Container>
			{settingsModalOpened && <SettingsModal onDismiss={() => setSettingsModalOpened(false)} />}
			{uniswapWidgetOpened && <UniswapModal onDismiss={() => setUniswapWidgetOpened(false)} />}
		</>
	);
};

const Container = styled.div``;

const StyledConnectionDot = styled(ConnectionDot)`
	margin-right: 6px;
`;

const MenuButton = styled(Button)`
	display: flex;
	align-items: center;
	margin-left: 15px;
`;

const SettingsText = styled.p`
	margin: 0px;
	margin-bottom: 5px;
	line-height: 10px;
	height: 10px;
	letter-spacing: 2px;
	text-align: center;
`;

const ConnectButton = styled(Button)`
	font-size: 13px;
`;

export default UserMenu;
