import responses

from sentry.models.activity import Activity
from sentry.notifications.notifications.activity.new_processing_issues import (
    NewProcessingIssuesActivityNotification,
)
from sentry.testutils.cases import SlackActivityNotificationTest
from sentry.testutils.helpers.features import with_feature
from sentry.testutils.helpers.slack import get_attachment
from sentry.types.activity import ActivityType
from sentry.web.frontend.debug.debug_new_processing_issues_email import get_issues_data


class SlackNewProcessingIssuesNotificationTest(SlackActivityNotificationTest):
    @responses.activate
    def test_new_processing_issue(self):
        """
        Test that a Slack message is sent with the expected payload when an issue is held back in reprocessing
        """

        notification = NewProcessingIssuesActivityNotification(
            Activity(
                project=self.project,
                user_id=self.user.id,
                type=ActivityType.NEW_PROCESSING_ISSUES,
                data={
                    "issues": get_issues_data(),
                    "reprocessing_active": True,
                },
            )
        )
        with self.tasks():
            notification.send()

        attachment, text = get_attachment()
        notification_uuid = self.get_notification_uuid(text)
        assert (
            text
            == f"Processing issues on <http://testserver/settings/{self.organization.slug}/projects/{self.project.slug}/processing-issues/?referrer=new_processing_issues_activity&notification_uuid={notification_uuid}|{self.project.slug}>"
        )
        assert (
            attachment["text"]
            == f"Some events failed to process in your project {self.project.slug}"
        )
        assert (
            attachment["footer"]
            == f"{self.project.slug} | <http://testserver/settings/account/notifications/workflow/?referrer=new_processing_issues_activity-slack-user&notification_uuid={notification_uuid}|Notification Settings>"
        )

    @responses.activate
    @with_feature("organizations:customer-domains")
    def test_new_processing_issue_customer_domains(self):
        notification = NewProcessingIssuesActivityNotification(
            Activity(
                project=self.project,
                user_id=self.user.id,
                type=ActivityType.NEW_PROCESSING_ISSUES,
                data={
                    "issues": get_issues_data(),
                    "reprocessing_active": True,
                },
            )
        )
        with self.tasks():
            notification.send()

        slug = self.organization.slug
        attachment, text = get_attachment()
        notification_uuid = self.get_notification_uuid(text)
        assert (
            text
            == f"Processing issues on <http://{slug}.testserver/settings/projects/{self.project.slug}/processing-issues/?referrer=new_processing_issues_activity&notification_uuid={notification_uuid}|{self.project.slug}>"
        )
        assert (
            attachment["text"]
            == f"Some events failed to process in your project {self.project.slug}"
        )
        assert (
            attachment["footer"]
            == f"{self.project.slug} | <http://{slug}.testserver/settings/account/notifications/workflow/?referrer=new_processing_issues_activity-slack-user&notification_uuid={notification_uuid}|Notification Settings>"
        )
