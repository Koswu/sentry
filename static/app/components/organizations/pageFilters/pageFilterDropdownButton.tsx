import styled from '@emotion/styled';

import DropdownButton from 'sentry/components/dropdownButton';

export default styled(DropdownButton)<{filledFromUrl?: boolean}>`
  width: 100%;
  height: 40px;
  text-overflow: ellipsis;
  ${p =>
    p.filledFromUrl &&
    `
    &,
    &:active,
    &:hover,
    &:focus {
      background-color: ${p.theme.purple100};
      border-color: ${p.theme.purple200};
    }
  `}
`;
