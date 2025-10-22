const { ApiResponse, ApiError, asyncHandler } = require('../../utils/apiResponse');

describe('ApiResponse', () => {
  it('should create successful response', () => {
    const response = new ApiResponse(200, { id: 1 }, 'Success');
    
    expect(response.statusCode).toBe(200);
    expect(response.data).toEqual({ id: 1 });
    expect(response.message).toBe('Success');
    expect(response.success).toBe(true);
    expect(response.timestamp).toBeDefined();
  });

  it('should create error response', () => {
    const response = new ApiResponse(400, null, 'Error');
    
    expect(response.statusCode).toBe(400);
    expect(response.success).toBe(false);
  });
});

describe('ApiError', () => {
  it('should create error with message', () => {
    const error = new ApiError(404, 'Not found');
    
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('Not found');
    expect(error.success).toBe(false);
    expect(error.timestamp).toBeDefined();
  });

  it('should capture stack trace', () => {
    const error = new ApiError(500, 'Internal error');
    
    expect(error.stack).toBeDefined();
  });
});

describe('asyncHandler', () => {
  it('should handle successful async function', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();
    
    const asyncFunction = asyncHandler(async (req, res, next) => {
      return 'success';
    });
    
    await asyncFunction(mockReq, mockRes, mockNext);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should handle async function errors', async () => {
    const mockReq = {};
    const mockRes = {};
    const mockNext = jest.fn();
    const error = new Error('Test error');
    
    const asyncFunction = asyncHandler(async (req, res, next) => {
      throw error;
    });
    
    await asyncFunction(mockReq, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});