'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTableColumns, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";


const columnHelper = createColumnHelper();

export default function InvitationsTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([{ id: 'updatedAt', desc: true }]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({
    householdName: false,
    rehearsalGuest: false,
    rehearsalMeal: false,
    creationDatetime: false,
  });
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const columnMenuRef = useRef(null);

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
            creationDatetime: invitation.sent_at,
            alerts: Array.isArray(invitation.alerts) ? invitation.alerts : [],
            title: guest.title || '',
            guestName: `${guest.title ? guest.title + ' ' : ''}${guest.given_name} ${guest.family_name}`,
            givenName: guest.given_name,
            familyName: guest.family_name,
            response: guest.rsvp_status 
              ? guest.rsvp_status.charAt(0).toUpperCase() + guest.rsvp_status.slice(1)
              : 'Pending',
            foodEater: guest.meal,
            isAdult: guest.is_adult,
            rehearsalGuest: guest.rehearsal_guest,
            rehearsalMeal: guest.rehearsal_meal,
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(event.target)) {
        setIsColumnMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let popovers = [];

    const initPopovers = async () => {
      const bootstrap = await import('bootstrap');
      const nodes = document.querySelectorAll('[data-bs-toggle="popover"]');

      popovers = Array.from(nodes).map((node) =>
        new bootstrap.Popover(node, {
          container: 'body',
          trigger: 'focus',
          placement: 'right',
          html: true,
          customClass: 'midnight-popover',
        })
      );
    };

    initPopovers();

    return () => {
      popovers.forEach((popover) => popover.dispose());
    };
  }, [data, columnVisibility]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('householdName', {
        header: 'Household',
        cell: (info) => {
          const row = info.row.original;
          const hasAlerts = Array.isArray(row.alerts) && row.alerts.length > 0;
          const escapeHtml = (value) =>
            String(value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#39;');
          const alertContent = hasAlerts
            ? `<ul class="mb-0 ps-3">${row.alerts
                .map((alert) => `<li>${escapeHtml(alert)}</li>`)
                .join('')}</ul>`
            : '';

          return (
            <span className="d-inline-flex align-items-center">
              <Link href={`/admin/rsvp/${row.inviteId}`} className="text-decoration-none">
                {info.getValue()}
              </Link>
              {hasAlerts && (
                <button
                  type="button"
                  className="btn btn-link text-warning p-0 ms-2 align-baseline"
                  data-bs-toggle="popover"
                  data-bs-title="Alerts"
                  data-bs-content={alertContent}
                  aria-label={`Show alerts for ${info.getValue()}`}
                >
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                </button>
              )}
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('guestName', {
        header: 'Guest Name',
        cell: (info) => {
          const row = info.row.original;
          return (
            <Link href={`/admin/rsvp/${row.inviteId}`} className="text-decoration-none">
              <span>{info.getValue()}</span>
            </Link>
          );
        },
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
      columnHelper.accessor('foodEater', {
        header: 'Meal',
        cell: (info) => {
          const value = info.getValue();
          return value
            ? <span className="badge bg-success">Meal</span>
            : <span className="badge bg-secondary">No meal</span>;
        },
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;
          return filterValue.includes(row.getValue(columnId));
        },
      }),
      columnHelper.accessor('rehearsalGuest', {
        header: 'Rehearsal Guest',
        cell: (info) => {
          const value = info.getValue();
          return value
            ? <span className="badge bg-success">Yes</span>
            : <span className="badge bg-secondary">No</span>;
        },
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: (row, columnId, filterValue) => {
          if (!filterValue || filterValue.length === 0) return true;
          return filterValue.includes(row.getValue(columnId));
        },
      }),
       columnHelper.accessor('rehearsalMeal', {
        header: 'Rehearsal Meal',
        cell: (info) => {
          const value = info.getValue();
          return value
            ? <span className="badge bg-success">Meal</span>
            : <span className="badge bg-secondary">No meal</span>;
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
      }),
      columnHelper.accessor('creationDatetime', {
        header: 'Created At',
        cell: (info) => {
          const date = new Date(info.getValue());
          return date.toLocaleString();
        },
        enableSorting: true,
        enableColumnFilter: false,
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const allLeafColumns = table.getAllLeafColumns();
  const visibleColumnCount = table.getVisibleLeafColumns().length;

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
              <div key={column.id} className="col-12 col-lg-4 col-md-6 mb-2">
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

          // Special handling for foodEater column
          if (column.id === 'foodEater') {
            const currentFilter = column.getFilterValue() || [];
            const toggleMeal = (value) => {
              const newFilter = currentFilter.includes(value)
                ? currentFilter.filter((v) => v !== value)
                : [...currentFilter, value];
              column.setFilterValue(newFilter.length > 0 ? newFilter : undefined);
            };

            return (
              <div key={column.id} className="col-12 col-lg-4 col-md-6 mb-2">
                <label className="form-label text-muted">
                  Filter {column.columnDef.header}
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id="filter-meal-yes"
                      checked={currentFilter.includes(true)}
                      onChange={() => toggleMeal(true)}
                    />
                    <label className="form-check-label" htmlFor="filter-meal-yes">
                      Meal
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id="filter-meal-no"
                      checked={currentFilter.includes(false)}
                      onChange={() => toggleMeal(false)}
                    />
                    <label className="form-check-label" htmlFor="filter-meal-no">
                      No Meal
                    </label>
                  </div>
                </div>
              </div>
            );
          }

          // Special handling for rehearsalGuest column
          if (column.id === 'rehearsalGuest') {
            const currentFilter = column.getFilterValue() || [];
            const toggleRehearsalGuest = (value) => {
              const newFilter = currentFilter.includes(value)
                ? currentFilter.filter((v) => v !== value)
                : [...currentFilter, value];
              column.setFilterValue(newFilter.length > 0 ? newFilter : undefined);
            };

            return (
              <div key={column.id} className="col-12 col-lg-4 col-md-6 mb-2">
                <label className="form-label text-muted">
                  Filter {column.columnDef.header}
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id="filter-rehearsal-guest-yes"
                      checked={currentFilter.includes(true)}
                      onChange={() => toggleRehearsalGuest(true)}
                    />
                    <label className="form-check-label" htmlFor="filter-rehearsal-guest-yes">
                      Yes
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id="filter-rehearsal-guest-no"
                      checked={currentFilter.includes(false)}
                      onChange={() => toggleRehearsalGuest(false)}
                    />
                    <label className="form-check-label" htmlFor="filter-rehearsal-guest-no">
                      No
                    </label>
                  </div>
                </div>
              </div>
            );
          }

          // Special handling for rehearsalMeal column
          if (column.id === 'rehearsalMeal') {
            const currentFilter = column.getFilterValue() || [];
            const toggleRehearsalMeal = (value) => {
              const newFilter = currentFilter.includes(value)
                ? currentFilter.filter((v) => v !== value)
                : [...currentFilter, value];
              column.setFilterValue(newFilter.length > 0 ? newFilter : undefined);
            };

            return (
              <div key={column.id} className="col-12 col-lg-4 col-md-6 mb-2">
                <label className="form-label text-muted">
                  Filter {column.columnDef.header}
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id="filter-rehearsal-meal-yes"
                      checked={currentFilter.includes(true)}
                      onChange={() => toggleRehearsalMeal(true)}
                    />
                    <label className="form-check-label" htmlFor="filter-rehearsal-meal-yes">
                      Meal
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id="filter-rehearsal-meal-no"
                      checked={currentFilter.includes(false)}
                      onChange={() => toggleRehearsalMeal(false)}
                    />
                    <label className="form-check-label" htmlFor="filter-rehearsal-meal-no">
                      No Meal
                    </label>
                  </div>
                </div>
              </div>
            );
          }
          
          // Default text input for other columns
          return (
            <div key={column.id} className="col-12 col-md-6 mb-2">
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
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    <div className="d-flex align-items-center justify-content-between gap-2">
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
                      {index === headerGroup.headers.length - 1 && (
                        <div
                          className="position-relative"
                          ref={columnMenuRef}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light"
                            aria-label="Show or hide table columns"
                            aria-haspopup="true"
                            aria-controls="column-visibility-menu"
                            aria-expanded={isColumnMenuOpen}
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsColumnMenuOpen((prev) => !prev);
                            }}
                          >
                            <FontAwesomeIcon icon={faTableColumns} aria-hidden="true" />
                            <span className="visually-hidden">Show or hide table columns</span>
                          </button>
                          {isColumnMenuOpen && (
                            <div
                              id="column-visibility-menu"
                              className="dropdown-menu-outline-midnight border rounded shadow p-2"
                              style={{
                                display: 'block',
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                minWidth: '15rem',
                                zIndex: 1000,
                              }}
                            >
                              {allLeafColumns.map((column) => {
                                const columnHeader = column.columnDef.header;
                                const label = typeof columnHeader === 'string' ? columnHeader : column.id;
                                const isVisible = column.getIsVisible();
                                const isOnlyVisibleColumn = isVisible && visibleColumnCount === 1;

                                return (
                                  <label
                                    key={column.id}
                                    className="d-flex align-items-center gap-2 px-2 py-1 mb-0"
                                  >
                                    <input
                                      type="checkbox"
                                      className="form-check-input form-check-input-midnight m-0"
                                      checked={isVisible}
                                      disabled={isOnlyVisibleColumn}
                                      onChange={column.getToggleVisibilityHandler()}
                                    />
                                    <span>{label}</span>
                                  </label>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={visibleColumnCount} className="text-center py-4">
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
