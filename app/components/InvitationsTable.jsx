'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';

const columnHelper = createColumnHelper();

export default function InvitationsTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  // Fetch data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rsvp/all');
        
        if (!response.ok) {
          throw new Error('Failed to fetch invitations');
        }

        const result = await response.json();
        
        // Transform the nested data structure into flat rows for the table
        const flattenedData = result.invitations.flatMap((invitation) =>
          invitation.guests.map((guest) => ({
            id: guest.guest_id,
            inviteId: invitation.invite_id,
            householdName: invitation.household_name,
            postalCode: invitation.postal_code,
            title: guest.title || '',
            guestName: `${guest.title ? guest.title + ' ' : ''}${guest.given_name} ${guest.family_name}`,
            givenName: guest.given_name,
            familyName: guest.family_name,
            response: guest.rsvp_status 
              ? guest.rsvp_status.charAt(0).toUpperCase() + guest.rsvp_status.slice(1)
              : 'Pending',
            isAdult: guest.is_adult,
            updatedAt: guest.updated_at,
          }))
        );

        setData(flattenedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching invitations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const columns = useMemo(
    () => [
      columnHelper.accessor('householdName', {
        header: 'Household',
        cell: (info) => {
          const row = info.row.original;
          return (
            <Link href={`/rsvp/${row.inviteId}`} className="text-decoration-none">
              {info.getValue()}
            </Link>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('guestName', {
        header: 'Guest Name',
        cell: (info) => info.getValue(),
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('response', {
        header: 'Response',
        cell: (info) => {
          const value = info.getValue();
          const badgeClass =
            value === 'Accepted'
              ? 'badge bg-success'
              : value === 'Declined'
              ? 'badge bg-danger'
              : 'badge bg-secondary';
          return <span className={badgeClass}>{value}</span>;
        },
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;
          return filterValue.includes(row.getValue(columnId));
        },
      }),
      columnHelper.accessor('updatedAt', {
        header: 'Last Updated',
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleString();
        },
        enableSorting: true,
        enableColumnFilter: false,
      })
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="container mt-4">
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="alert alert-danger" role="alert">
          Error loading invitations: {error}
        </div>
      )}

      {/* Table content - only show when not loading */}
      {!loading && !error && (
        <>
          {/* Filter inputs */}
          <div className="row mb-3">
        {table.getAllColumns().map((column) => {
          if (!column.getCanFilter()) return null;
          
          // Special handling for response column
          if (column.id === 'response') {
            const currentFilter = column.getFilterValue() || [];
            const toggleStatus = (status) => {
              const newFilter = currentFilter.includes(status)
                ? currentFilter.filter((s) => s !== status)
                : [...currentFilter, status];
              column.setFilterValue(newFilter.length > 0 ? newFilter : undefined);
            };
            
            return (
              <div key={column.id} className="col-md-4 mb-2">
                <label className="form-label text-muted">
                  Filter {column.columnDef.header}
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id="filter-accepted"
                      checked={currentFilter.includes('Accepted')}
                      onChange={() => toggleStatus('Accepted')}
                    />
                    <label className="form-check-label" htmlFor="filter-accepted">
                      Accepted
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id="filter-pending"
                      checked={currentFilter.includes('Pending')}
                      onChange={() => toggleStatus('Pending')}
                    />
                    <label className="form-check-label" htmlFor="filter-pending">
                      Pending
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id="filter-declined"
                      checked={currentFilter.includes('Declined')}
                      onChange={() => toggleStatus('Declined')}
                    />
                    <label className="form-check-label" htmlFor="filter-declined">
                      Declined
                    </label>
                  </div>
                </div>
              </div>
            );
          }
          
          // Default text input for other columns
          return (
            <div key={column.id} className="col-md-4 mb-2">
              <label className="form-label text-muted">
                Filter {column.columnDef.header}
              </label>
              <input
                type="text"
                className="form-control form-control-midnight form-control-sm"
                value={column.getFilterValue() ?? ''}
                onChange={(e) => column.setFilterValue(e.target.value)}
                placeholder={`Search ${column.columnDef.header}...`}
              />
            </div>
          );
        })}
      </div>

      {/* Clear filters button */}
      <div className="mb-3">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setColumnFilters([])}
          disabled={columnFilters.length === 0}
        >
          Clear All Filters
        </button>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className='table-midnight'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    <div className="d-flex align-items-center">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="ms-2">
                        {header.column.getIsSorted() === 'asc' && '↑'}
                        {header.column.getIsSorted() === 'desc' && '↓'}
                        {!header.column.getIsSorted() && '⇅'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No results found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="mt-3">
        <small className="text-muted">
          Showing {table.getRowModel().rows.length} of {data.length} total
          entries
        </small>
      </div>
        </>
      )}
    </div>
  );
}
