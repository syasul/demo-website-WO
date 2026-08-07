<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicWeddingController;
use App\Http\Controllers\AdminLeadController;
use App\Http\Controllers\AdminWeddingController;
use App\Http\Controllers\AdminReportController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminSettingController;
use App\Http\Controllers\AdminActivityLogController;
use App\Http\Controllers\AdminPricingTierController;

// Public Endpoints - Wedding
Route::get('categories', [PublicWeddingController::class, 'categories']);
Route::get('packages', [PublicWeddingController::class, 'packages']);
Route::get('packages/{slug}', [PublicWeddingController::class, 'packageDetail']);
Route::get('addons', [PublicWeddingController::class, 'addons']);
Route::post('calculator/estimate', [PublicWeddingController::class, 'estimatePrice']);
Route::post('quotations', [PublicWeddingController::class, 'createQuotation']);
Route::get('testimonials', [PublicWeddingController::class, 'testimonials']);
Route::get('galleries', [PublicWeddingController::class, 'galleries']);
Route::post('contact', [PublicWeddingController::class, 'contactSubmit']);

// Authentication Endpoints
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('me', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// Admin Endpoints (Protected by Sanctum Auth)
Route::prefix('admin')->middleware(['auth:sanctum'])->group(function () {
    
    // CRM Leads
    Route::get('leads', [AdminLeadController::class, 'index']);
    Route::get('leads/{id}', [AdminLeadController::class, 'show']);
    Route::patch('leads/{id}/status', [AdminLeadController::class, 'updateStatus']);
    Route::patch('leads/{id}/assign', [AdminLeadController::class, 'assign']);
    Route::post('leads/{id}/activities', [AdminLeadController::class, 'addActivity']);

    // Packages, Menus, Addons, and Pricing Tiers Management
    Route::get('packages', [AdminWeddingController::class, 'listPackages']);
    Route::get('menu-items', [AdminWeddingController::class, 'listMenuItems']);
    Route::get('addons', [AdminWeddingController::class, 'listAddons']);
    Route::get('categories', [AdminWeddingController::class, 'listCategories']);
    Route::get('pricing-tiers', [AdminPricingTierController::class, 'index']);
    Route::post('pricing-tiers/preview', [AdminPricingTierController::class, 'preview']);

    // Pricing Tiers write operations
    Route::post('pricing-tiers', [AdminPricingTierController::class, 'store']);
    Route::put('pricing-tiers/{id}', [AdminPricingTierController::class, 'update']);
    Route::delete('pricing-tiers/{id}', [AdminPricingTierController::class, 'destroy']);

    // Write operations
    Route::post('packages', [AdminWeddingController::class, 'storePackage']);
    Route::put('packages/{id}', [AdminWeddingController::class, 'updatePackage']);
    Route::delete('packages/{id}', [AdminWeddingController::class, 'destroyPackage']);
    Route::post('packages/{id}/duplicate', [AdminWeddingController::class, 'duplicatePackage']);

    Route::post('menu-items', [AdminWeddingController::class, 'storeMenuItem']);
    Route::put('menu-items/{id}', [AdminWeddingController::class, 'updateMenuItem']);
    Route::delete('menu-items/{id}', [AdminWeddingController::class, 'destroyMenuItem']);

    Route::post('addons', [AdminWeddingController::class, 'storeAddon']);
    Route::put('addons/{id}', [AdminWeddingController::class, 'updateAddon']);
    Route::delete('addons/{id}', [AdminWeddingController::class, 'destroyAddon']);

    // Reports (Dashboard and charts)
    Route::prefix('reports')->group(function () {
        Route::get('dashboard-stats', [AdminReportController::class, 'dashboardStats']);
        Route::get('funnel', [AdminReportController::class, 'funnel']);
        Route::get('popular-packages', [AdminReportController::class, 'popularPackages']);
        Route::get('leads-by-month', [AdminReportController::class, 'leadsByMonth']);
    });

    // Settings
    Route::get('settings', [AdminSettingController::class, 'getSettings']);
    Route::put('settings', [AdminSettingController::class, 'updateSettings']);

    // User Management
    Route::prefix('users')->group(function () {
        Route::get('/', [AdminUserController::class, 'index']);
        Route::post('/', [AdminUserController::class, 'store']);
        Route::put('/{id}', [AdminUserController::class, 'update']);
        Route::delete('/{id}', [AdminUserController::class, 'destroy']);
    });

    // Activity Log
    Route::get('activity-logs', [AdminActivityLogController::class, 'index']);
});