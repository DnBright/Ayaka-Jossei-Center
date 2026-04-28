@extends('layouts.role-dashboard', [
    'dashboardRole' => 'admin',
    'pageTitle' => 'Admin Dashboard',
    'pageHeading' => 'Dashboard Overview',
    'roleLabel' => 'Super Admin',
])

@section('dashboard-content')
    @include('partials.role-dashboard-overview', ['dashboardRole' => 'admin'])
@endsection
