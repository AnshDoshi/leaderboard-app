import { useEffect, useState } from "react";
import { getLeaderboard, recalculateLeaderboard } from "../services/api";

interface User {
  id: number;
  fullName: string;
  totalPoints: number;
  rank: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [searchedUserId, setSearchedUserId] = useState<number | null>(null);

  const fetchLeaderboard = async () => {
    const res = await getLeaderboard(filter, search);
    setUsers(res.data);
    setSearchedUserId(search ? parseInt(search) : null);
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const handleRecalculate = async () => {
    await recalculateLeaderboard();
    fetchLeaderboard();
  };

  const handleClear = () => {
    setSearch("");
    setSearchedUserId(null);
    fetchLeaderboard();
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Leaderboard</h2>

      <div className="row mb-3">
        <div className="col-md-3">
          <button
            className="btn btn-primary btn-block"
            onClick={handleRecalculate}
          >
            Recalculate
          </button>
        </div>

        <form
          className="col-md-5 d-flex"
          onSubmit={(e) => {
            e.preventDefault();
            fetchLeaderboard(); // Trigger search based on `search` state
          }}
        >
          <input
            type="number"
            placeholder="Search by User ID"
            className="form-control mr-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-secondary mr-2" type="submit">
            Search
          </button>
          <button
            className="btn btn-outline-danger"
            type="button"
            onClick={handleClear}
          >
            Clear
          </button>
        </form>

        <div className="col-md-4">
          <select
            className="form-control"
            onChange={(e) => setFilter(e.target.value)}
            value={filter}
          >
            <option value="">All Time</option>
            <option value="day">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="alert alert-warning text-center mt-4">
          No data found.
        </div>
      ) : (
        <table className="table table-striped table-bordered text-center">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Total Points</th>
              <th>Rank</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const highlight = user.id === searchedUserId;
              return (
                <tr
                  key={user.id}
                  className={highlight ? "table-warning font-weight-bold" : ""}
                >
                  <td>{user.id}</td>
                  <td>{user.fullName}</td>
                  <td>{user.totalPoints}</td>
                  <td>#{user.rank}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
