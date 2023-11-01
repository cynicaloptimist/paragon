import { faGlobe, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function AddToCampaignIcon(): JSX.Element {
  return (
    <span className="fa-layers fa-fw">
      <FontAwesomeIcon icon={faGlobe} />
      <FontAwesomeIcon
        icon={faShare}
        transform={{
          size: 12,
          x: -12,
          y: -8,
          rotate: 24,
        }}
      />
    </span>
  );
}
