import {useMemo} from 'react';

import {useReplayContext} from 'sentry/components/replays/replayContext';
import {useApiQuery} from 'sentry/utils/queryClient';
import hydrateA11yFrame, {RawA11yResponse} from 'sentry/utils/replays/hydrateA11yFrame';
import useOrganization from 'sentry/utils/useOrganization';
import useProjects from 'sentry/utils/useProjects';

export default function useA11yData() {
  const organization = useOrganization();
  const {replay} = useReplayContext();
  const {projects} = useProjects();

  const replayRecord = replay?.getReplay();
  const startTimestampMs = replayRecord?.started_at.getTime();
  const project = projects.find(p => p.id === replayRecord?.project_id);

  const {data, ...rest} = useApiQuery<RawA11yResponse>(
    [
      `/projects/${organization.slug}/${project?.slug}/replays/${replayRecord?.id}/accessibility-issues/`,
    ],
    {
      staleTime: 0,
      enabled: Boolean(project) && Boolean(replayRecord),
    }
  );

  const hydrated = useMemo(
    () => data?.data?.flatMap(record => hydrateA11yFrame(record, startTimestampMs ?? 0)),
    [data?.data, startTimestampMs]
  );
  return {data: hydrated, ...rest};
}
