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

const columnHelper = createColumnHelper();

export default function InvitationsTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [editingGuest, setEditingGuest] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', givenName: '', familyName: '' });
  const [saveError, setSaveError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const titleInputRef = useRef(null);

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
            foodEater: guest.food_eater,
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

  useEffect(() => {
    if (editingGuest && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingGuest]);

  const openEditModal = (guest) => {
    setEditingGuest(guest);
    setEditForm({
      title: guest.title || '',
      givenName: guest.givenName || '',
      familyName: guest.familyName || '',
    });
    setSaveError(null);
  };

  const closeEditModal = () => {
    if (isSaving) return;
    setEditingGuest(null);
    setSaveError(null);
  };

  const handleSaveGuest = async () => {
    if (!editingGuest) return;

    const givenName = editForm.givenName.trim();
    const familyName = editForm.familyName.trim();
    const title = editForm.title.trim();

    if (!givenName || !familyName) {
      setSaveError('Given name and family name are required.');
      return;
    }

    try {
      setIsSaving(true);
      setSaveError(null);

      const response = await fetch(
        `/api/rsvp/${editingGuest.inviteId}/guest/${editingGuest.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            given_name: givenName,
            family_name: familyName,
          }),
        }
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || 'Failed to update guest');
      }

      const updatedTitle = payload.title || '';
      const updatedGiven = payload.given_name || givenName;
      const updatedFamily = payload.family_name || familyName;

      setData((prev) =>
        prev.map((row) =>
          row.id === editingGuest.id
            ? {
                ...row,
                title: updatedTitle,
                givenName: updatedGiven,
                familyName: updatedFamily,
                guestName: `${updatedTitle ? updatedTitle + ' ' : ''}${updatedGiven} ${updatedFamily}`,
                updatedAt: new Date().toISOString(),
              }
            : row
        )
      );

      setEditingGuest(null);
    } catch (err) {
      setSaveError(err.message || 'Failed to update guest');
    } finally {
      setIsSaving(false);
    }
  };

  const handleModalKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeEditModal();
      return;
    }

    if (event.key === 'Enter') {
      const targetTagName = event.target?.tagName?.toLowerCase();
      if (targetTagName === 'textarea') return;
      event.preventDefault();
      if (!isSaving) {
        handleSaveGuest();
      }
    }
  };


  const columns = useMemo(
    () => [
      columnHelper.accessor('householdName', {
        header: 'Household',
        cell: (info) => {
          const row = info.row.original;
          return (
            <Link href={`/admin/rsvp/${row.inviteId}`} className="text-decoration-none">
              {info.getValue()}
            </Link>
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
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none text-start"
              onClick={() => openEditModal(row)}
            >
              {info.getValue()}
            </button>
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
            ? <span className="badge bg-success">Signed Up</span>
            : <span className="badge bg-secondary">Not Signed Up</span>;
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
              <div key={column.id} className="col-12 col-lg-4 mb-2">
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
              <div key={column.id} className="col-12 col-lg-4 mb-2">
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
                      Signed Up
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
                      Not Signed Up
                    </label>
                  </div>
                </div>
              </div>
            );
          }
          
          // Default text input for other columns
          return (
            <div key={column.id} className="col-6 col-md-4 mb-2">
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

      {editingGuest && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            onKeyDown={handleModalKeyDown}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Guest</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={closeEditModal}
                    disabled={isSaving}
                  />
                </div>
                <div className="modal-body">
                  {saveError && (
                    <div className="alert alert-danger" role="alert">
                      {saveError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="edit-title" className="form-label">Title</label>
                    <input
                      ref={titleInputRef}
                      id="edit-title"
                      type="text"
                      className="form-control"
                      maxLength={50}
                      value={editForm.title}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edit-given-name" className="form-label">Given Name</label>
                    <input
                      id="edit-given-name"
                      type="text"
                      className="form-control"
                      value={editForm.givenName}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, givenName: e.target.value }))
                      }
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-family-name" className="form-label">Family Name</label>
                    <input
                      id="edit-family-name"
                      type="text"
                      className="form-control"
                      value={editForm.familyName}
                      onChange={(e) =>
                        setEditForm((prev) => ({ ...prev, familyName: e.target.value }))
                      }
                      disabled={isSaving}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-midnight-outline"
                    onClick={closeEditModal}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-midnight"
                    onClick={handleSaveGuest}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" onClick={closeEditModal} />
        </>
      )}
    </div>
  );
}
