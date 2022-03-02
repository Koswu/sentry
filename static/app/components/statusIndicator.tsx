import styled from '@emotion/styled';

import Tooltip from 'sentry/components/tooltip';

type Props = {
  status: string;
  tooltipTitle: string;
};

/**
 * A badge/indicator at the beginning of the row that displays
 * the color of the status level (Warning, Error, Success, etc)
 *
 */
function StatusIndicator({status, tooltipTitle}: Props) {
  let color: string = 'error';

  if (status === 'muted') {
    color = 'muted';
  } else if (status === 'info') {
    color = 'info';
  } else if (status === 'warning') {
    color = 'warning';
  } else if (status === 'success' || status === 'resolved') {
    color = 'success';
  }

  return (
    <StatusLevel color={color}>
      <BadgeTooltip title={tooltipTitle} />
    </StatusLevel>
  );
}

type BadgeTooltipProps = {
  title?: string;
};

function BadgeTooltip({title}: BadgeTooltipProps) {
  return (
    <Tooltip title={title}>
      <span />
    </Tooltip>
  );
}

export default StatusIndicator;

const StatusLevel = styled('div')<{color: string}>`
  position: absolute;
  left: -1px;
  width: 9px;
  height: 15px;
  border-radius: 0 3px 3px 0;

  background-color: ${p => p.theme.alert[p.color].background};
  & span {
    display: block;
    width: 9px;
    height: 15px;
  }
`;
