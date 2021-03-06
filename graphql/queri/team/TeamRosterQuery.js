import gql from 'graphql-tag';

export const GET_TEAM_ROSTER = gql`
  query TeamRosterQuery($teamId: ID!) {
    team(team_id: $teamId) {
      team_id
      full_name
      short_name
      description
      social_profile
      site
      logo
      cover
      main_form_color
      spare_form_color
      is_deleted
      is_archived
      players {
        player_id
        first_name
        middle_name
        last_name
        birthday
        birthplace
        vk_profile
        position_id
        photo
        application {
          team_id
          player_id
          status
          in
          out
        }
      }
    }
  }
`;
