import { useAuth } from "./AuthContext";

/** Users can only this component if they are authorized by the API. */
export default function Tunnel() {
  const { logout } = useAuth();

  return (
    <section>
      <p>The tablet vibrates and a jadeite chime rings through the air.</p>
      <p>
        The earth beneath your feet trembles as the badgers slowly push the two
        doors of the gate open.
      </p>
      <p>You step into the tunnel, and your journey continues.</p>
      <button onClick={logout}>Reset Game</button>
    </section>
  );
}
